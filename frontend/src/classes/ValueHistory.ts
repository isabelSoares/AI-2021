import moment from "moment";

export class ValueHistory {
    id: string;
    timestamp: moment.Moment;
    path_propertyValue: string;

    constructor(id :string, timestamp: string, path_propertyValue: string) {
        this.id = id;
        this.timestamp = moment(timestamp);
        this.path_propertyValue = path_propertyValue;
    }
}

export async function load_valueHistory (id: string, data : {timestamp : string, path_propertyValue: string}) : Promise<ValueHistory> {
    let new_valueHistory = new ValueHistory(id, data.timestamp , data.path_propertyValue);

    return new_valueHistory;
}