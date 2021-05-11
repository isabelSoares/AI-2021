
export class PropertyType {
    type: string;
    constructor(type: string) {
        this.type = type;
    }

    format() { return "None"; }
}

export function load_property_type(data: any) : PropertyType {
    let new_propertyType : PropertyType;
    if (data.type == "Enum") new_propertyType = load_propertyEnum(data);
    else if (data.type == "Scalar") new_propertyType = load_propertyScalar(data);
    else new_propertyType = new PropertyType(data);

    return new_propertyType;
}

class PropertyEnum extends PropertyType {
    values: string[];

    constructor(type: string, values: string[]) {
        super(type);
        
        this.values = values;
    }

    format() {
        let line = this.type;
        return line;
    }
}

function load_propertyEnum(data : {type: string, values: string[]}) : PropertyEnum {
    let new_propertyEnum = new PropertyEnum(data.type, data.values);

    return new_propertyEnum;
}

class PropertyScalar extends PropertyType {
    minValue : number;
    maxValue : number;
    step : number;
    units : string[];

    constructor(type: string, minValue : number, maxValue : number, step : number, units : string[]) {
        super(type);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        this.units = units;
    }

    format() {
        let line = this.type + ": (";
        line = line + "min = " + this.minValue + ", ";
        line = line + "max = " + this.maxValue + ", ";
        line = line + "step = " + this.step + ", ";
        line = line + "units = " + this.units + ")";

        return line;
    }
}

function load_propertyScalar(data : {type: string, minValue : number, maxValue : number, step : number, units : string[]}) : PropertyScalar {
    let new_propertyScalar = new PropertyScalar(data.type, data.minValue, data.maxValue, data.step, data.units);

    return new_propertyScalar;
}