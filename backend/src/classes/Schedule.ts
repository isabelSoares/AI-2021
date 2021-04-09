export class Schedule {
    timestamp: Date;

    constructor(timestamp: Date) {
        this.timestamp = timestamp;
    }
}

export function load_schedule(data : FirebaseFirestore.DocumentData) : Schedule {
    let timestamp: Date = new Date(data['timestamp']['_seconds'] * 1000);
    let new_schedule = new Schedule(timestamp)

    return new_schedule;
}