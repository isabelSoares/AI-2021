import { Property } from '@/classes/Property';

import Router from '@/utils/endpointAPI';

export class DeviceType {
    id: string;
    name: string;
    paths_properties: string[];

    // Objects
    properties: Property[] | undefined;

    constructor(id: string, name: string, paths_properties: string[]) {
        this.id = id;this.name = name;
        this.paths_properties = paths_properties;

        this.properties = undefined;
    }

    async load_properties() {
        this.properties = [];
        
        await Promise.all(this.paths_properties.map(async (path_to_property) => {
            let property_id = path_to_property.replace("properties/", "");
            let property = await Router.load_property(property_id);

            this.properties?.push(property);
        }));
    }
}

export function load_deviceType(id: string, data : {name: string, paths_properties: string[]}) : DeviceType {
    let new_deviceType = new DeviceType(id, data.name, data.paths_properties);

    return new_deviceType;
}