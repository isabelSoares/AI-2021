import { PropertyType, load_property_type } from '@/classes/PropertyType';

export class Property {
    id: string;
    name: string;
    type: PropertyType;

    constructor(id: string, name: string, type: PropertyType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

export function load_property(id: string, data : {name: string, type: any}) : Property {
    let new_property_type = load_property_type(data.type)
    let new_property = new Property(id, data.name, new_property_type);

    return new_property;
}