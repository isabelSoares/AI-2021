import { Property } from '@/classes/Property';
import { Device } from './Device';

import Router from '@/utils/endpointAPI';

export class PropertyValue {
    id: string;
    value: number;
    path_property: string;
    path_device: string;

    // Objects
    property: Property | undefined;
    device: Device | undefined;

    constructor(id: string,  value: number, path_property : string, path_device : string) {
        this.id = id;
        this.value = value;
        this.path_property = path_property;
        this.path_device = path_device;
        // Objects
        this.property = undefined;
        this.device = undefined;
    }

    async load_property() {
        let property_id = this.path_property.replace("properties/", "");
        this.property = await Router.load_property(property_id);
    }

    async load_device() {
        let device_id = this.path_device.replace("devices/", "");
        this.device = await Router.load_device(device_id);
    }

    set_value(value: number) : boolean {
        this.value = value;
        return this.property != undefined && this.property.type.check_valid_value(value);
    }
}

export function load_propertyValue(id: string, data : {value: number, path_property: string, path_device : string}) : PropertyValue {
    let new_propertyValue = new PropertyValue(id, data.value, data.path_property, data.path_device);

    return new_propertyValue;
}