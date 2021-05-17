import { PropertyType, load_property_type } from '@/classes/PropertyType';

export class Property {
    id: string;
    name: string;
    writable: boolean;
    type: PropertyType;

    constructor(id: string, name: string,writable : boolean, type: PropertyType) {
        this.id = id;
        this.name = name;
        this.writable = writable;
        this.type = type;
    }
}

export function load_property(id: string, data : {name: string, writable: boolean, type: any}) : Property {
    let new_property_type = load_property_type(data.type)
    let new_property = new Property(id, data.name, data.writable, new_property_type);

    return new_property;
}