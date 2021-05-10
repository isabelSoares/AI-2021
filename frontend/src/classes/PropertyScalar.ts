import { Property } from '@/classes/Property';

export class PropertyScalar extends Property {
    minValue : number;
    maxValue : number;
    step : number;
    units : string[];

    constructor(id: string, name: string, type: string, minValue : number, maxValue : number, step : number, units : string[]) {
        super(id, name, type);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
        this.units = units;
    }
}

export function load_propertyScalar(id: string, data : {name: string, type: string, minValue : number, maxValue : number, step : number, units : string[]}) : PropertyScalar {
    let new_propertyScalar = new PropertyScalar(id, data.name, data.type, data.minValue, data.maxValue, data.step, data.units);

    return new_propertyScalar;
}