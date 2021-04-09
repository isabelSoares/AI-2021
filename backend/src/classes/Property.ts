export class Property {
    name: string;
    type: PropertyType;

    constructor(name: string, type: PropertyType) {
        this.name = name;
        this.type = type;
    }
}

export function load_property(data : FirebaseFirestore.DocumentData) : Property {
    let name : string = data['name'];
    let type_name : string = data['type'];
    let type = load_type(type_name, data);

    let new_property = new Property(name, type)

    return new_property;
}

export function load_type(type_name : string, data : FirebaseFirestore.DocumentData) : PropertyType {

    let type: PropertyType = new Unknown();
    switch(type_name){
        case "SCALAR":
            let min_value : number = data['minValue'];
            let max_value : number = data['maxValue'];
            let step : number = data['step'];
            let units : string = data['units'];
            type = new Scalar(min_value, max_value, step, units);
            break;

        case "ENUM":
            let valueS : string[] = data['values'];
            type = new Enum(valueS);
            break;
    }

    return type;
}

// ========= TYPES =========
enum Type {
    SCALAR = "Scalar",
    ENUM = "Enumerator",
    UNKNOWN = "Unknown",
}

interface PropertyType {
    type: Type;
}

class Scalar implements PropertyType {
    type: Type;
    minValue: number;
    maxValue: number;
    step: number;
    units: string;

    constructor(minValue: number, maxValue: number, step: number, units: string) {
        this.type = Type.SCALAR;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        this.units = units;
    }
}

class Enum implements PropertyType {
    type: Type;
    values: string[];

    constructor(values: string[]) {
        this.type = Type.ENUM;
        this.values = values;
    }
}

class Unknown implements PropertyType {
    type: Type;

    constructor() {
        this.type = Type.UNKNOWN;
    }
}