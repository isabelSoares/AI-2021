import * as admin from 'firebase-admin';

import { get_reference, get_document, change_document, create_document} from './firebase/firebase_connect'

// Classes
import { load_user } from './classes/User'
import { load_house } from './classes/House'
import { load_floor } from './classes/Floor'
import { load_division } from './classes/Division'
import { Device, load_device } from './classes/Device'
import { load_device_type } from './classes/DeviceType'
import { load_property } from './classes/Property'
import { load_propertyValue } from './classes/PropertyValue'
import { load_schedule } from './classes/Schedule'
import { load_preference } from './classes/Preference'
import { load_valueHistory } from './classes/ValueHistory'

// Get Favorite Devices
export async function get_favorite_devices(user_id: string) : Promise<{'id': string, 'device': Device}[]> {

    // Load User
    let data_user = await get_document('users', user_id);
    if (data_user == undefined) return [];
    let user = load_user(data_user);

    // Load Houses
    let data_houses = await Promise.all(user.paths_houses.map(async (path_to_house) => {
        let house_id = path_to_house.replace("houses/", "");
        return get_document('houses', house_id);
    }));
    let houses = data_houses.filter((data_house): data_house is FirebaseFirestore.DocumentData => !!data_house)
        .map((data_house) => load_house(data_house));

    // Load Floors
    let data_floors = await Promise.all(houses.map(async (house) => {
        return await Promise.all(house.paths_floors.map(async (path_to_floor) => {
            let floor_id = path_to_floor.replace("floors/", "");
            return await get_document('floors', floor_id);
        }));
    }));
    let floors = data_floors.reduce((acc, curVal) => acc.concat(curVal))
        .filter((data_floor): data_floor is FirebaseFirestore.DocumentData => !!data_floor)
        .map((data_floor) => load_floor(data_floor));

    // Load Divisions
    let data_divisions = await Promise.all(floors.map(async (floor) => {
        return await Promise.all(floor.paths_divisions.map(async (path_to_division) => {
            let division_id = path_to_division.replace("divisions/", "");
            return await get_document('divisions', division_id);
        }));
    }));
    let divisions = data_divisions.reduce((acc, curVal) => acc.concat(curVal))
        .filter((data_division): data_division is FirebaseFirestore.DocumentData => !!data_division)
        .map((data_division) => load_division(data_division));

    // Load Devices
    let data_devices = await Promise.all(divisions.map(async (division) => {
        return await Promise.all(division.paths_devices.map(async (path_to_device) => {
            let device_id = path_to_device.replace("devices/", "");
            let device = await get_document('devices', device_id);
            return {'id': device_id, 'device': device};
        }));
    }));
    let devices = data_devices.reduce((acc, curVal) => acc.concat(curVal))
        .filter((data_device): data_device is {'id': string, 'device': FirebaseFirestore.DocumentData} => !!data_device)
        .map((data_device) => { return {'id': data_device.id, 'device': load_device(data_device.device)}});

    return devices.filter((element) => element.device.favorite);
}

export async function change_property_value(propertyValue_id: string, value: number) : Promise<string | undefined> {

    // Get property value previously stored
    let previousPropertyValueReference = await get_reference('propertyValues', propertyValue_id);
    let previousPropertyValue = await (await previousPropertyValueReference.get()).data();
    if (previousPropertyValue == undefined) return undefined;
    
    // Create new property and store it
    let newPropertyValueData = {
        'device': previousPropertyValue['device'],
        'property': previousPropertyValue['property'],
        'value': value,
    }
    let newPropertyValueReference = await create_document('propertyValues', newPropertyValueData);

    // Create new value history and save it
    let newValueHistoryData = {
        'propertyValue': newPropertyValueReference,
        'timestamp': admin.firestore.Timestamp.fromDate(new Date()),
    }
    let valueHistoryReference = await create_document('valuesHistory', newValueHistoryData);
    
    // Get device to change
    let deviceReference = previousPropertyValue['device'];
    let device = await previousPropertyValue['device'].get();
    let deviceData = await device.data();
    // Get device information to be changed
    let deviceProperties = deviceData['propertyValues'];
    let deviceValuesHistory = deviceData['valuesHistory'];
    // Change device
    let newDeviceProperties = deviceProperties.filter((ref: any) => !ref.isEqual(previousPropertyValueReference));
    newDeviceProperties.push(newPropertyValueReference);
    deviceValuesHistory.push(valueHistoryReference);
    // Store back information
    deviceReference.update({ 'propertyValues': newDeviceProperties, 'valuesHistory': deviceValuesHistory });

    return newPropertyValueReference.id;
}