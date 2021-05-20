import moment from "moment";

import { PropertyValue } from '@/classes/PropertyValue';

import Router from '@/utils/endpointAPI';

export class ValueHistory {
    id: string;
    timestamp: moment.Moment;
    path_propertyValue: string;
    // Object
    propertyValue: PropertyValue | undefined;

    constructor(id :string, timestamp: string, path_propertyValue: string) {
        this.id = id;
        this.timestamp = moment(timestamp);
        this.path_propertyValue = path_propertyValue;
        // Object
        this.propertyValue = undefined;
    }

    async load_propertyValue() {
        let propertyValue_id = this.path_propertyValue.replace("propertyValues/", "");
        this.propertyValue = await Router.load_propertyValue(propertyValue_id);
    }
}

export async function load_valueHistory (id: string, data : {timestamp : string, path_propertyValue: string}) : Promise<ValueHistory> {
    let new_valueHistory = new ValueHistory(id, data.timestamp , data.path_propertyValue);

    return new_valueHistory;
}