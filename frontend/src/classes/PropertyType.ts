
export class PropertyType {
    type: string;
    constructor(type: string) {
        this.type = type;
    }

    format() { return "None"; }
    get_units() : string { return "None"; }
    get_values() : {'key': number, 'value': string}[] { return []; }
    check_valid_value(value: number) { console.log("Noooooooooooo"); return false; }
}

export function load_property_type(data: any) : PropertyType {
    let new_propertyType : PropertyType;
    if (data.type == "Enumerator") new_propertyType = load_propertyEnum(data);
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

    get_units() : string { return "None"; }
    get_values() : {'key': number, 'value': string}[] {
        return this.values.map((value, index) => {
            return {'key': index, 'value': value};
        });
    }

    check_valid_value(value: number) { return true; }
}

function load_propertyEnum(data : {type: string, values: string[]}) : PropertyEnum {
    let new_propertyEnum = new PropertyEnum(data.type, data.values);

    return new_propertyEnum;
}

class PropertyScalar extends PropertyType {
    minValue : number;
    maxValue : number;
    step : number;
    units : string;

    constructor(type: string, minValue : number, maxValue : number, step : number, units : string) {
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

    get_units() : string { return this.units; }
    get_values() : {'key': number, 'value': string}[] { return []; }
    check_valid_value(value: number) {
        console.log(value);
        let divisible = (Math.round((value / this.step) * 100) / 100) % 1 == 0;
        return value >= this.minValue && value <= this.maxValue && divisible; 
    }
}

function load_propertyScalar(data : {type: string, minValue : number, maxValue : number, step : number, units : string}) : PropertyScalar {
    let new_propertyScalar = new PropertyScalar(data.type, data.minValue, data.maxValue, data.step, data.units);

    return new_propertyScalar;
}