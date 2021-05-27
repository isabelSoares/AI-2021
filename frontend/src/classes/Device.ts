import underscore from 'underscore';
import moment from 'moment';

import { DeviceType } from '@/classes/DeviceType';
import { ValueHistory } from '@/classes/ValueHistory';
import { PropertyValue } from '@/classes/PropertyValue';

import Router from '@/utils/endpointAPI';

export class Device {
    id: string;
    name: string;
    favorite : boolean;
    path_deviceType: string;
    paths_propertyValues: string[];
    paths_valuesHistory: string[];

    // Objects
    deviceType: DeviceType | undefined;
    propertyValues: PropertyValue[] | undefined;
    valuesHistory: ValueHistory[] | undefined;

    constructor(id: string, name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[], paths_valuesHistory: string[]) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.path_deviceType = path_deviceType;
        this.paths_propertyValues = paths_propertyValues;
        this.paths_valuesHistory = paths_valuesHistory;
        // Objects
        this.deviceType = undefined;
        this.propertyValues = undefined;
        this.valuesHistory = undefined;
    }

    async pre_load() {
        await this.load_deviceType();
    }

    async full_load() {
        await this.load_propertyValues().then(async () => {
            if (!this.propertyValues) return;

            await Promise.all(this.propertyValues.map(async (propertyValue) => {
                await propertyValue.load_property();
            }));
        });

        await this.load_valuesHistory();
    }

    async load_deviceType() {
        let deviceType_id = this.path_deviceType.replace("deviceTypes/", "");
        this.deviceType = await Router.load_deviceType(deviceType_id);
    }

    async load_propertyValues() {
        this.propertyValues = [];
        
        await Promise.all(this.paths_propertyValues.map(async (path_propertyValue) => {
            let propertyValue_id = path_propertyValue.replace("propertyValues/", "");
            let propertyValue = await Router.load_propertyValue(propertyValue_id);

            this.propertyValues?.push(propertyValue);
        }));
    }

    async load_valuesHistory() {
        this.valuesHistory = [];
        
        await Promise.all(this.paths_valuesHistory.map(async (path_valueHistory) => {
            let valueHistory_id = path_valueHistory.replace("valuesHistory/", "");
            let valueHistory = await Router.load_valueHistory(valueHistory_id);

            this.valuesHistory?.push(valueHistory);
        }));
    }

    // ==================== CHANGE EVENTS ====================
    async change_favorite_state() {
        if (this.favorite) Router.remove_favorites(this.id);
        else Router.add_favorites(this.id);
        
        this.favorite = !this.favorite;
    }
    
    change_property_value(propertyValue_id: string, value: number) {
        let propertyValue = this.propertyValues?.find((propertyValue) => propertyValue.id == propertyValue_id);
        if (propertyValue != undefined) { return propertyValue.set_value(value); }
        return true;
    }
    
    // ==================== SEND EVENTS ====================

    async save_new_properties(user_id: string, reference_device: Device) {
        if (this.propertyValues == undefined) return;

        let to_be_saved_properties : PropertyValue[] = this.propertyValues?.filter((propertyValue) => {

            let propertyValueId = propertyValue.id;
            let propertyValueReference = reference_device.propertyValues?.find((refPropertyValue) => refPropertyValue.id == propertyValueId);

            if (propertyValueReference == undefined) return true;
            else return !underscore.isEqual(propertyValue, propertyValueReference);
        });

        await Promise.all(to_be_saved_properties.map(async (propertyValue) => {
            let propertyValue_id = propertyValue.id;
            let propertyValue_value = propertyValue.value;

            let new_id = await Router.change_property_value(user_id, propertyValue_id, propertyValue_value);
            // Update propertyValue id
            let previous_propertyValue = this.propertyValues?.find((storedProperty) => storedProperty.id == propertyValue.id);
            if (previous_propertyValue != undefined) { previous_propertyValue.id = new_id; }
            // Update propertyValue path
            let old_path = "propertyValues/" + propertyValue_id;
            let new_path = "propertyValues/" + new_id;
            this.paths_propertyValues = this.paths_propertyValues.map(element => element == old_path ? new_path : element);
        }));
    }

    // ==================== OTHER UTILS ====================

    async get_graph_data() : Promise<any> {
        if (this.valuesHistory == undefined) return undefined;

        const hours_by_division = 2;
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let now = moment();

        // First filter values for the last 7 days (inclusive)
        let historyThisWeek = this.valuesHistory.filter(history => now.diff(history.timestamp, 'days') < 7);
        await Promise.all(historyThisWeek.map(async (element) => {
            await element.load_propertyValue();
            await element.propertyValue?.load_property();
        }));

        let sortedHistories = historyThisWeek.sort((a, b) => a.timestamp.diff(b.timestamp))

        // Divide by property
        let binnedByPropperty : any = {}
        sortedHistories.forEach(element => {
            let propertyId = element.propertyValue?.property?.id;
            if (propertyId == undefined) return;
            
            if (!(propertyId in binnedByPropperty)) binnedByPropperty[propertyId] = [];
            binnedByPropperty[propertyId].push(element);
        });
    
        let binnedByWeekdayHour : any = {};
        
        for (let propertyId in binnedByPropperty) {
            let startDate = moment().subtract(6, 'days').hour(0).minute(0).second(0);
            let endDate = moment().add(1, 'days').hour(0).minute(0).second(0);
            let currentDate = moment(startDate);

            binnedByWeekdayHour[propertyId] = {}; 

            let histories : ValueHistory[] = binnedByPropperty[propertyId];
            let current_index = -1;
            let current_value = 0;
            while (currentDate.isBefore(endDate)) {
    
                let weekDay = weekDays[currentDate.day()];
                let hour = currentDate.hour();
    
                if (!(weekDay in binnedByWeekdayHour[propertyId])) binnedByWeekdayHour[propertyId][weekDay] = {}
                if (!(hour in binnedByWeekdayHour[propertyId][weekDay])) binnedByWeekdayHour[propertyId][weekDay][hour] = {}
    
                while (current_index + 1 < histories.length && currentDate.isAfter(histories[current_index + 1].timestamp)) {
                    current_index = current_index + 1;
                    let value_stored = histories[current_index].propertyValue?.value;
                    if (value_stored != undefined) current_value = value_stored;
                }
                
                binnedByWeekdayHour[propertyId][weekDay][hour] = current_value;
    
                // Update date counter
                currentDate.add(hours_by_division, 'hours');
            }
        }
        
        // Convert to propper data format
        let data : any = {};
        for (let propertyId in binnedByWeekdayHour) {
            data[propertyId] = []

            for (let hour = 0; hour < 24; hour = hour + hours_by_division) {
                let new_object : any = { 'name': hour }
                weekDays.forEach(weekday => new_object[weekday] = binnedByWeekdayHour[propertyId][weekday][hour]);

                data[propertyId].push(new_object);
            }
        }

        return data;
    }
}

export async function load_device(id: string, data : {name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[], paths_valuesHistory: string[]}) : Promise<Device> {
    let new_device = new Device(id, data.name, data.favorite, data.path_deviceType , data.paths_propertyValues, data.paths_valuesHistory);
    await new_device.pre_load()

    return new_device;
}