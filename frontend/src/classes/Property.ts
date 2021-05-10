export class Property {
    id: string;
    name: string;
    type: string;

    constructor(id: string, name: string, type: string) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

export function load_property(id: string, data : {name: string, type: string}) : Property {
    let new_property = new Property(id, data.name, data.type);

    return new_property;
}