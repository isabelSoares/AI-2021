import moment from 'moment';

import { PropertyValue } from '@/classes/PropertyValue';
import { Schedule } from '@/classes/Schedule';

import Router from '@/utils/endpointAPI';

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
                await propertyValue.load_property()
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
}

export async function load_preference(id: string, data : {name: string, pendent: boolean, deactivated: string, paths_schedules: string[], paths_propertyValues: string[]}) : Promise<Preference> {
    let new_preference = new Preference(id, data.name, data.pendent, data.deactivated, data.paths_schedules, data.paths_propertyValues);

    return new_preference;
}