import * as admin from 'firebase-admin';
import { get_reference, get_document, change_document, create_document} from './firebase/firebase_connect';

import moment from 'moment';
let timeseries = require('timeseries-analysis');

import { load_device } from './classes/Device';
import { load_propertyValue } from './classes/PropertyValue';

const SECONDS_IN_DAY = 60 * 60 * 24;
const DIVISIONS = 100;
const GO_BACK_DAYS = 2;

let seconds_in_division = SECONDS_IN_DAY / DIVISIONS;
type Entry = {'device': string, 'property': string, 'set_value': number};

class IntelligenceModule {
    entriesToCheck: Entry[];

    constructor() {
        this.entriesToCheck = [{'device': '3NBwsKco8OaoI35fApiF', 'property': 'Psw565S3N2c51YxW6Yoq', 'set_value': 1}];
    }

    add_entry(entry: Entry) { this.entriesToCheck.push(entry); }

    async process_entry() {
        // If nothing to process skip
        if (this.entriesToCheck.length == 0) return;

        // Get entry to process
        let entry = this.entriesToCheck.shift();
        if (entry == undefined) return;

        // Processing entry
        await get_information_needed(entry);
    }
}

async function get_information_needed(entry: Entry) {

    let now = moment();

    // Load Device
    let deviceData = await get_document('devices', entry['device']);
    if (deviceData == undefined) return undefined;

    // Load Property
    let propertyReference = await get_reference('properties', entry['property']);

    // Load Values History
    let deviceValuesHistory = deviceData['valuesHistory'];
    let valuesHistory : {'timestamp': moment.Moment, 'value': number }[] = await Promise.all(
        deviceValuesHistory.map(async (valueHistoryRef : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) => {

            let valueHistoryDocument : FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await valueHistoryRef.get();
            let valueHistoryData : FirebaseFirestore.DocumentData | undefined = valueHistoryDocument.data();
            if (valueHistoryData == undefined) return undefined;
            
            let propertyValueRef : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = valueHistoryData['propertyValue'];
            let propertyValueDocument : FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = await propertyValueRef.get();
            let propertyValueData : FirebaseFirestore.DocumentData | undefined = propertyValueDocument.data();
            
            // If it doesn't pertrain to the correct property
            if (propertyValueData == undefined) return undefined;
            let propertyRef = propertyValueData['property'];
            if (!propertyRef.isEqual(propertyReference)) return undefined;
            
            // If timestamp not from last 7 days not important
            let timestamp = moment(new Date(valueHistoryData['timestamp']['_seconds'] * 1000));
            let dayDiff = now.diff(timestamp, 'days');
            if (dayDiff >= GO_BACK_DAYS) return undefined;
            
            // Else should be added to pertaining
            return {'timestamp': timestamp, 'value': propertyValueData['value']};
        })
    );

    let valueHistoryFixed = valuesHistory.filter((element) => element != undefined);

    console.log(valuesHistory);

    let specificValueHistory = valueHistoryFixed.map((element) => {
        let saved_value = element['value'];
        let new_value = entry['set_value'] == saved_value ? 1 : 0;
        return {'timestamp': element['timestamp'], 'value': new_value};
    }).sort((n1, n2) => n1['timestamp'].diff(n2['timestamp']));

    console.log(specificValueHistory);
    
    let current_index = 0;
    let current_value = 0;
    let startDate = moment().subtract(GO_BACK_DAYS, 'days').hour(0).minute(0).second(0);
    let endDate = moment().subtract(1, 'days').hour(0).minute(0).second(0);
    let currentDate = moment(startDate);
    
    let data : any = [];
    let index = 0;
    while (currentDate.isBefore(endDate)) {

        if (index >= data.length) {
            let date_to_push = moment().hour(currentDate.hour())
                .minute(currentDate.minute())
                .second(currentDate.second());
            
            data.push([date_to_push, 0]);
        }

        while (current_index + 1 < specificValueHistory.length 
            && currentDate.isAfter(specificValueHistory[current_index + 1]['timestamp'])) current_index = current_index + 1;

        current_value = specificValueHistory[current_index]['value']
        data[index][1] = data[index][1] + current_value / GO_BACK_DAYS;

        // Update date counter
        let tempDate = moment(currentDate);
        currentDate.add(seconds_in_division, 'seconds');
        index = index + 1;

        // Check if new day
        if (tempDate.dayOfYear() != currentDate.dayOfYear()) index = 0;
    }

    //console.log(data);

    var t = new timeseries.main(data);
    console.log(t.chart());
    console.log(t.ma().chart());
}

export default new IntelligenceModule();