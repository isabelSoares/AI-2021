import * as admin from 'firebase-admin';
import { get_reference, get_document, create_document, create_document_with_id, get_user_from_email } from './firebase/firebase_connect';

// Classes
import { load_user } from './classes/User';
import { load_house } from './classes/House';
import { load_floor } from './classes/Floor';
import { load_division } from './classes/Division';
import { Device, load_device } from './classes/Device';
import { load_device_type } from './classes/DeviceType';
import { load_property } from './classes/Property';
import { load_propertyValue } from './classes/PropertyValue';
import { load_schedule } from './classes/Schedule';
import { load_preference } from './classes/Preference';
import { load_valueHistory } from './classes/ValueHistory';

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
    if (data_floors.length == 0) return [];
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
    if (data_divisions.length == 0) return [];
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
    if (data_devices.length == 0) return [];
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

export async function add_new_user(name: string, user_id: string) : Promise<FirebaseFirestore.DocumentData | undefined> {

    let userDataToSave = { 'name': name, 'houses': [], 'preferences': [] };
    let userReference = await create_document_with_id('users', user_id, userDataToSave);
    let userDocument = await userReference.get();
    let userData = userDocument.data();

    return { 'id': user_id, 'data': userData };
}

export async function add_new_house(name: string, user_id: string) : Promise<FirebaseFirestore.DocumentData | undefined> {

    // Retrieve Reference
    let userReference = await get_reference('users', user_id);

    // Create Document
    let houseDataToSave = {
        'name': name,
        'users': [userReference],
        'floors': [],
    }

    let houseReference = await create_document('houses', houseDataToSave);

    // Load House
    let houseDocument = await houseReference.get();
    let houseData = houseDocument.data();

    // Update User
    let userDocument = await userReference.get();
    let userData = userDocument.data();
    if (userData == undefined) return undefined;
    let user_houses = userData['houses'];
    user_houses.push(houseReference);
    await userReference.update({ 'houses': user_houses });

    return { 'id': houseReference.id, 'data': houseData };
}

export async function add_new_floor(name: string, house_id: string) : Promise<FirebaseFirestore.DocumentData | undefined> {

    // Retrieve Reference
    let houseReference = await get_reference('houses', house_id);

    // Create Document
    let floorDataToSave = {
        'name': name,
        'house': houseReference,
        'divisions': [],
    }

    let floorReference = await create_document('floors', floorDataToSave);

    // Load Floor
    let floorDocument = await floorReference.get();
    let floorData = floorDocument.data();

    // Update House
    let houseDocument = await houseReference.get();
    let houseData = houseDocument.data();
    if (houseData == undefined) return undefined;
    let house_floors = houseData['floors'];
    house_floors.push(floorReference);
    await houseReference.update({ 'floors': house_floors });

    return { 'id': floorReference.id, 'data': floorData };
}

export async function add_new_division(name: string, floor_id: string) : Promise<FirebaseFirestore.DocumentData | undefined> {

    // Retrieve Reference
    let floorReference = await get_reference('floors', floor_id);

    // Create Document
    let divisionDataToSave = {
        'name': name,
        'floor': floorReference,
        'devices': [],
    }

    let divisionReference = await create_document('divisions', divisionDataToSave);

    // Load Division
    let divisionDocument = await divisionReference.get();
    let divisionData = divisionDocument.data();

    // Update Floor
    let floorDocument = await floorReference.get();
    let floorData = floorDocument.data();
    if (floorData == undefined) return undefined;
    let floor_divisions = floorData['divisions'];
    floor_divisions.push(divisionReference);
    await floorReference.update({ 'divisions': floor_divisions });

    return { 'id': divisionReference.id, 'data': divisionData };
}

export async function add_new_device(name: string, division_id: string, deviceType_id: string, favorite: boolean, propertyValues: {'property_id': string, 'value': number}[]) : Promise<FirebaseFirestore.DocumentData | undefined> {
    
    // Retrieve Reference Division and Device Type
    let divisionReference = await get_reference('divisions', division_id);
    let deviceTypeReference = await get_reference('deviceTypes', deviceType_id);
    
    // Create Document
    let deviceDataToSave = {
        'name': name,
        'deviceType': deviceTypeReference,
        'division': divisionReference,
        'favorite': favorite,
        'propertyValues': [],
        'valuesHistory': [],
    }
    
    let deviceReference = await create_document('devices', deviceDataToSave);
    
    // Create Property Values
    let propertyValueReferences = await Promise.all(propertyValues.map(async (propertyValue) => {
        let propertyReference = await get_reference('properties', propertyValue.property_id);

        let propertyValueToSave = {
            'device': deviceReference,
            'property': propertyReference,
            'value': propertyValue.value,
        }

        return await create_document('propertyValues', propertyValueToSave);
    }));

    // Update device create with new propertyValues
    deviceReference.update({'propertyValues': propertyValueReferences});
    
    // Create Values History for PropertyValues
    let valuesHistoryReferences = await Promise.all(propertyValueReferences.map(async (propertyValueReference) => {
        let valueHistoryToSave = {
            'propertyValue': propertyValueReference,
            'timestamp': admin.firestore.Timestamp.fromDate(new Date()),
        }
        
        return await create_document('valuesHistory', valueHistoryToSave);
    }));
    
    // Update device create with new valuesHistory
    deviceReference.update({'valuesHistory': valuesHistoryReferences});
    
    // Load Device
    let deviceDocument = await deviceReference.get();
    let deviceData = deviceDocument.data();

    // Update Division
    let divisionDocument = await divisionReference.get();
    let divisionData = divisionDocument.data();
    if (divisionData == undefined) return undefined;
    let division_devices = divisionData['devices'];
    division_devices.push(deviceReference);
    await divisionReference.update({ 'devices': division_devices });

    return { 'id': deviceReference.id, 'data': deviceData };
}

export async function add_house_to_user(house_id: string, user_email: string) : Promise<FirebaseFirestore.DocumentData | undefined> {

    // Get User Id
    let user = await get_user_from_email(user_email);
    let user_id = user.uid;

    // Get House Reference
    let houseReference = await get_reference('houses', house_id);
    let houseDocument = await houseReference.get();
    let houseData = houseDocument.data();
    // Get User Reference
    let userReference = await get_reference('users', user_id);
    let userDocument = await userReference.get();
    let userData = userDocument.data();

    if (houseData == undefined || userData == undefined) return undefined;

    // Update House
    let house_users = houseData['users'];
    let alreadyAddedUser = house_users.some((user : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) => userReference.isEqual(user))
    if (!alreadyAddedUser) {
        house_users.push(userReference);
        await houseReference.update({ 'users': house_users });
    }

    // Update User
    let user_houses = userData['houses'];
    let alreadyAddedHouse = user_houses.some((house : FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) => houseReference.isEqual(house))
    if (!alreadyAddedHouse) {
        user_houses.push(houseReference);
        await userReference.update({ 'houses': user_houses });
    }

    return houseData;
}