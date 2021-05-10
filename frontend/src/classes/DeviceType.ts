import axios from 'axios';

import { Property, load_property } from '@/classes/Property';
import { load_propertyScalar } from '@/classes/PropertyScalar';
import { load_propertyEnum } from '@/classes/PropertyEnum';

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
        let address : string = "http://localhost:8000/property/";
        this.properties = [];
        
        await Promise.all(this.paths_properties.map(async (path_to_property) => {
            let path_to_property_corrected = path_to_property.replace("properties/", "");
            let complete_address = address + path_to_property_corrected;
            const response = await axios.get(complete_address);

            if (typeof response.data === "string") {
                console.log("ERROR");
            } else {
                let new_property;
                if (response.data.type == "SCALAR") new_property = load_propertyScalar(path_to_property_corrected, response.data);
                else if (response.data.type == "ENUM") new_property = load_propertyEnum(path_to_property_corrected, response.data);
                else new_property = load_property(path_to_property_corrected, response.data);
                
                this.properties?.push(new_property);
            }
        }));
    }
}

export function load_deviceType(id: string, data : {name: string, paths_properties: string[]}) : DeviceType {
    let new_deviceType = new DeviceType(id, data.name, data.paths_properties);

    return new_deviceType;
}