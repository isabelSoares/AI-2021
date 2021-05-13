import { Property } from '@/classes/Property';

import Router from '@/utils/endpointAPI';

export class PropertyValue {
    id: string;
    value: number;
    path_property: string;

    // Objects
    property: Property | undefined;

    constructor(id: string,  value: number, path_property : string) {
        this.id = id;
        this.value = value;
        this.path_property = path_property;
        // Objects
        this.property = undefined;
    }

    async load_property() {
        let property_id = this.path_property.replace("properties/", "");
        this.property = await Router.load_property(property_id);
    }

    set_value(value: number) : boolean {
        this.value = value;
        return this.property != undefined && this.property.type.check_valid_value(value);
    }
}

export function load_propertyValue(id: string, data : {value: number, path_property: string}) : PropertyValue {
    let new_propertyValue = new PropertyValue(id, data.value, data.path_property);

    return new_propertyValue;
}