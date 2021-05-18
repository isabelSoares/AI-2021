import moment from "moment";

export class Schedule {
    id: string;
    timestamp: moment.Moment;

    constructor(id: string, timestamp: string) {
        this.id = id;
        this.timestamp = moment(timestamp);
    }
}

export function load_schedule(id: string, data : {timestamp: string}) : Schedule {
    let new_schedule = new Schedule(id, data.timestamp);

    return new_schedule;
}