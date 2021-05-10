import { Property } from '@/classes/Property';

export class PropertyEnum extends Property {
    values: string[];

    constructor(id: string, name: string, type: string, values: string[]) {
        super(id, name, type);

        this.values = values;
    }
}

export function load_propertyEnum(id: string, data : {name: string, type: string, values: string[]}) : PropertyEnum {
    let new_propertyEnum = new PropertyEnum(id, data.name, data.type, data.values);

    return new_propertyEnum;
}