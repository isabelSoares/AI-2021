import moment from 'moment';

import { PropertyValue } from '@/classes/PropertyValue';
import { Schedule } from '@/classes/Schedule';

import Router from '@/utils/endpointAPI';
import { any } from 'underscore';
import { Device } from './Device';
import { Property } from './Property';

export class Preference {
    id: string;
    name: string;
    pendent: boolean;
    deactivated: moment.Moment;
    paths_schedules: string[];
    paths_propertyValues: string[];
    // Objects
    schedules: Schedule[] | undefined;
    propertyValues: PropertyValue[] | undefined;
    // Utils
    deleted = false;
    save_state: any = {};

    constructor(id: string, name: string, pendent:boolean, deactivated: string, paths_schedules: string[], paths_propertyValues: string[]) {
        this.id = id;
        this.name = name;
        this.deactivated = moment(deactivated);
        this.pendent = pendent;
        this.paths_schedules = paths_schedules;
        this.paths_propertyValues = paths_propertyValues;
        // Objects
        this.schedules = undefined;
        this.propertyValues = undefined;
    }

    async full_load() {
        await this.load_propertyValues().then(async () => {
            if (!this.propertyValues) return;

            await Promise.all(this.propertyValues.map(async (propertyValue) => {
                await propertyValue.load_device();
                await propertyValue.load_property();
            }));
        });

        await this.load_schedules();
    }

    async load_propertyValues() {
        this.propertyValues = [];
        
        await Promise.all(this.paths_propertyValues.map(async (path_propertyValue) => {
            let propertyValue_id = path_propertyValue.replace("propertyValues/", "");
            let propertyValue = await Router.load_propertyValue(propertyValue_id);

            this.propertyValues?.push(propertyValue);
        }));
    }
    
    async load_schedules() {
        this.schedules = [];
        
        await Promise.all(this.paths_schedules.map(async (path_schedule) => {
            let schedule_id = path_schedule.replace("schedules/", "");
            let schedule = await Router.load_schedule(schedule_id);

            this.schedules?.push(schedule);
        }));
    }

    // ======================== CHANGE STATE ASYNC ========================

    async accept() {
        await Router.accept_preference(this.id);
        this.pendent = false;
    }

    async reject() {
        await Router.reject_preference(this.id);
        this.deleted = true;
    }

    async deactivate() {
        await Router.deactivate_preference(this.id);
        this.deactivated = moment().add(1, 'days');
    }

    async apply() {
        await Router.apply_preference(this.id);
    }

    // ======================== CHANGE STATE ========================

    clear_save_state() {
        this.save_state = undefined;
    }

    save_state_locally(data: any) {
        this.save_state = data;
    }

    get_save_state() {

        if (this.save_state == undefined) return undefined;
        
        let treated_data = {
            'name': this.save_state.name,
            'properties': this.save_state.properties.map( (elem: {'device': Device, 'property': Property, 'value': number} ) => {
                return {'device': elem.device.id, 'property': elem.property.id, 'value': elem.value }
            }),
            'schedules': this.save_state.schedules.map( (elem : string) => { return { 'timestamp': elem }})
        }

        return treated_data;
    }
}

export async function load_preference(id: string, data : {name: string, pendent: boolean, deactivated: string, paths_schedules: string[], paths_propertyValues: string[]}) : Promise<Preference> {
    let new_preference = new Preference(id, data.name, data.pendent, data.deactivated, data.paths_schedules, data.paths_propertyValues);

    return new_preference;
}