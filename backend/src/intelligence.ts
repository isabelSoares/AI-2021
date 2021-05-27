import * as admin from 'firebase-admin';
import { get_reference, get_document, create_document } from './firebase/firebase_connect';

import moment from 'moment';

const SECONDS_IN_DAY = 60 * 60 * 24;

const DIVISIONS = 100;
const GO_BACK_DAYS = 7;
const THRESHOLD = 0.90;

let seconds_in_division = SECONDS_IN_DAY / DIVISIONS;
type Entry = {'user': string, 'device': string, 'property': string, 'set_value': number};

class IntelligenceModule {
    entriesToCheck: Entry[];

    constructor() {
        this.entriesToCheck = [];
    }

    add_entry(entry: Entry) { this.entriesToCheck.push(entry); }
    async register_value_change(user_id: string, propertyValue_id: string, value: number) {

        // Get property value previously stored
        let previousPropertyValueReference = await get_reference('propertyValues', propertyValue_id);
        let previousPropertyValue = await (await previousPropertyValueReference.get()).data();
        if (previousPropertyValue == undefined) return undefined;

        let deviceReference : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = previousPropertyValue['device'];
        let propertyReference : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = previousPropertyValue['property'];;

        let newEntry = { 'user': user_id, 'device': deviceReference.id, 'property': propertyReference.id, 'set_value': value };
        this.add_entry(newEntry);
    }

    async process_entry() {
        // If nothing to process skip
        if (this.entriesToCheck.length == 0) return;

        // Get entry to process
        let entry = this.entriesToCheck.shift();
        if (entry == undefined) return;

        // Processing entry
        await run_entry(entry);
    }
}

async function run_entry(entry: Entry) {
    console.log("Processing: ", entry);
    let now = moment();

    // Load User
    let userReference = await get_reference('users', entry['user']);
    let userDocument = await userReference.get();
    let userData = userDocument.data();
    if (userData == undefined) return undefined;

    // Load Device
    let deviceReference = await get_reference('devices', entry['device']);
    let deviceDocument = await deviceReference.get();
    let deviceData = deviceDocument.data();
    if (deviceData == undefined) return undefined;

    // Load Property
    let propertyReference = await get_reference('properties', entry['property']);
    let propertyDocument = await propertyReference.get();
    let propertyData = propertyDocument.data();
    if (propertyData == undefined) return

    // =========================== Get Values History filtering as needed ===========================

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
    
    // =========================== Normalize Value ===========================
    
    let specificValueHistory = valueHistoryFixed.map((element) => {
        let saved_value = element['value'];
        let new_value = entry['set_value'] == saved_value ? 1 : 0;
        return {'timestamp': element['timestamp'], 'value': new_value};
    }).sort((n1, n2) => n1['timestamp'].diff(n2['timestamp']));
    
    // =========================== Get Data in correct format ===========================

    let current_index = 0;
    let current_value = 0;
    let startDate = moment().subtract(GO_BACK_DAYS, 'days').hour(0).minute(0).second(0);
    let endDate = moment().subtract(1, 'days').hour(0).minute(0).second(0);
    let currentDate = moment(startDate);
    
    let data : [moment.Moment, number][] = [];
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

   // =========================== Get Timestamps that surpass Threshold ===========================
   
   let timestampsSaved = [];
   for (let i = 0; i < data.length - 1; i++) {
       
       let [_, value] = data[i];
       let [next_timestamp, next_value] = data[i + 1];
       // Check and add
       if (value < THRESHOLD && next_value >= THRESHOLD) {
           // Closest timestamp
           let minuteInHour = next_timestamp.minute();
           minuteInHour = Math.round( minuteInHour / 5 ) * 5; 
           timestampsSaved.push(next_timestamp.minute(minuteInHour).second(0).millisecond(0));
        }
    }
    
    console.log(timestampsSaved);

    // =========================== Create Preference ===========================

    if (timestampsSaved.length > 0) {

        let name = deviceData['name'] + ": " + propertyData['name'] + " with " + entry['set_value'];
        let pendent = true;
        let deactivated = admin.firestore.Timestamp.fromDate(new Date('1970-01-01Z00:00:00:000'));
        let user = userReference;
        let propertyValues = [ await create_document('propertyValues', {'device': deviceReference, 'property': propertyReference, 'value': entry['set_value']}) ]
        let schedules = await Promise.all(timestampsSaved.map(async (timestamp) => {
            let timestampConverted = await admin.firestore.Timestamp.fromDate(timestamp.toDate());
            return create_document('schedules', { 'timestamp': timestampConverted });
        }));
    
        let preferenceData = {
            'name': name,
            'pendent': pendent,
            'deactivated': deactivated,
            'user': user,
            'propertyValues': propertyValues,
            'schedules': schedules,
        }
    
        let preferenceReference = await create_document('preferences', preferenceData);
    
        // Update User
        let user_preferences = userData['preferences'];
        user_preferences.push(preferenceReference);
        await userReference.update({ 'preferences': user_preferences });
    }
}

export default new IntelligenceModule();