import { DeviceType } from '@/classes/DeviceType';
import { PropertyValue } from '@/classes/PropertyValue';

import Router from '@/utils/endpointAPI';

export class Device {
    id: string;
    name: string;
    favorite : boolean;
    path_deviceType: string;
    paths_propertyValues: string[];

    // Objects
    deviceType: DeviceType | undefined;
    propertyValues: PropertyValue[] | undefined;

    constructor(id: string, name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[]) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.path_deviceType = path_deviceType;
        this.paths_propertyValues = paths_propertyValues;
        // Objects
        this.deviceType = undefined;
        this.propertyValues = undefined;
        
        this.pre_load();
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
}

export function load_device(id: string, data : {name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[]}) : Device {
    let new_device = new Device(id, data.name, data.favorite, data.path_deviceType , data.paths_propertyValues);

    return new_device;
}