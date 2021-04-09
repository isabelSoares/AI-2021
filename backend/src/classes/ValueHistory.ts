export class ValueHistory {
    timestamp: Date;
    propertyValue: string;

    constructor(timestamp: Date, propertyValue: string) {
        this.timestamp = timestamp;
        this.propertyValue = propertyValue;
    }
}

export function load_valueHistory(data : FirebaseFirestore.DocumentData) : ValueHistory {
    let timestamp: Date = new Date(data['timestamp']['_seconds'] * 1000);
    let path_to_propertyValue : string = data['propertyValue']['_path']['segments'].join('/');
    let new_valueHistory = new ValueHistory(timestamp, path_to_propertyValue)

    return new_valueHistory;
}