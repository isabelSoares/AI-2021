import axios from 'axios';

import { DeviceType, load_deviceType } from '@/classes/DeviceType';

export class Device {
    id: string;
    name: string;
    favorite : boolean;
    path_deviceType: string;
    paths_propertyValues: string[];

    // Objects
    deviceType: DeviceType | undefined;

    constructor(id: string, name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[]) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.path_deviceType = path_deviceType;
        this.deviceType = undefined;
        this.paths_propertyValues = paths_propertyValues;

        this.pre_load();
    }

    async pre_load() {
        await this.load_deviceType();
    }

    async full_load() {
        await this.deviceType?.load_properties();
    }

    async load_deviceType() {
        let address : string = "http://localhost:8000/deviceType/";

        let path_to_deviceType_corrected = this.path_deviceType.replace("deviceTypes/", "");
        let complete_address = address + path_to_deviceType_corrected;
        const response = await axios.get(complete_address);

        if (typeof response.data === "string") {
            console.log("ERROR");
        } else this.deviceType = load_deviceType(path_to_deviceType_corrected, response.data);
    }
}

export function load_device(id: string, data : {name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[]}) : Device {
    let new_device = new Device(id, data.name, data.favorite, data.path_deviceType , data.paths_propertyValues);

    return new_device;
}