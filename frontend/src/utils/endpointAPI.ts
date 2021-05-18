import axios, {AxiosResponse} from 'axios';

import firebase from 'firebase/app';
import 'firebase/auth';
// ====================== INITIALIZE FIREBASE ======================
var firebaseConfig = {
    apiKey: "AIzaSyCK1LsPeN6-muuM4HZbqM5tuFS_KljMPa4",
    authDomain: "smarthome-7298f.firebaseapp.com",
    projectId: "smarthome-7298f",
    storageBucket: "smarthome-7298f.appspot.com",
    messagingSenderId: "1009618421285",
    appId: "1:1009618421285:web:df2d9be6f7fbfe0985a1cc",
    measurementId: "G-MR04N6WKBB"
};
firebase.initializeApp(firebaseConfig);

import { PropertyValue, load_propertyValue } from '@/classes/PropertyValue';
import { ValueHistory, load_valueHistory } from '@/classes/ValueHistory';
import { DeviceType, load_deviceType } from '@/classes/DeviceType';
import { Preference, load_preference } from '@/classes/Preference';
import { Property, load_property } from '@/classes/Property';
import { Division, load_division } from '@/classes/Division';
import { Schedule, load_schedule } from '@/classes/Schedule';
import { Device, load_device } from '@/classes/Device';
import { Floor, load_floor } from '@/classes/Floor';
import { House, load_house } from '@/classes/House';
import { User, load_user } from '@/classes/User';

class RouterAPI {
    domain: string;

    constructor(domain: string) {
        this.domain = domain;
    }

    // ================ GENERAL REQUESTS ================
    async get(address: string) : Promise<AxiosResponse<any>> {
        return axios.get(address);
    }

    async post(address: string, body: any) : Promise<AxiosResponse<any>> {
        return axios.post(address, body);
    }

    async delete(address: string) : Promise<AxiosResponse<any>> {
        return axios.delete(address);
    }
    
    // ================ SPECIFIC REQUESTS : LOADS  ================

    async load_user(user_email: string, user_password: string) : Promise<User | undefined> {

        // Register New User
        let user = await firebase.auth().signInWithEmailAndPassword(user_email, user_password).then((userCredential) => {
            return userCredential.user;
        }).catch((error) => {
            console.log(error);
            return null;
        });
        if (user == null) return undefined;

        let user_id = user.uid;
        let address : string = this.domain + "user/" + user_id;

        return new Promise<User>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_user(user_id, response.data));
            });
        });
    }

    async load_deviceType(device_type_id: string) : Promise<DeviceType> {
        let address : string = this.domain + "device_type/" + device_type_id;

        return new Promise<DeviceType>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_deviceType(device_type_id, response.data));
            });
        });
    }

    async load_deviceTypes() : Promise<DeviceType[]> {
        let address : string = this.domain + "device_type/";

        return new Promise<DeviceType[]>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else {
                    let deviceTypes = response.data.map((deviceTypeData: {'id': string, 'object': any}) => {
                        let id = deviceTypeData.id;
                        let data = deviceTypeData.object;
                        return load_deviceType(id, data);
                    });

                    resolve(deviceTypes);
                };
            });
        });
    }
    
    async load_preference(preference_id : string) : Promise<Preference> {
        let address : string = this.domain + "preference/" + preference_id;

        return new Promise<Preference>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_preference(preference_id, response.data));
            });
        });
    }

    async load_schedule(schedule_id : string) : Promise<Schedule> {
        let address : string = this.domain + "schedule/" + schedule_id;

        return new Promise<Schedule>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_schedule(schedule_id, response.data));
            });
        });
    }

    async load_house(house_id : string) : Promise<House> {
        let address : string = this.domain + "house/" + house_id;

        return new Promise<House>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_house(house_id, response.data));
            });
        });
    }
    
    async load_floor(floor_id : string) : Promise<Floor> {
    
        let address : string = this.domain + "floor/" + floor_id;
        
        return new Promise<Floor>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_floor(floor_id, response.data));
            });
        });
    }
    
    async load_division(division_id: string) {
        let address : string = this.domain + "division/" + division_id;

        return new Promise<Division>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_division(division_id, response.data));
            });
        });
    }
    
    async load_device(device_id: string) {
        let address : string = this.domain + "device/" + device_id;

        return new Promise<Device>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_device(device_id, response.data));
            });
        });
    }
    
    async load_property(property_id: string) {
        let address : string = this.domain + "property/" + property_id;

        return new Promise<Property>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_property(property_id, response.data));
            });
        });
    }
    

    async load_propertyValue(propertyValue_id: string) {
        let address : string = this.domain + "property_value/" + propertyValue_id;

        return new Promise<PropertyValue>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_propertyValue(propertyValue_id, response.data));
            });
        });
    }
    
    async load_favorites(user_id: string) {
        let address : string = this.domain + "favorites/" + user_id;

        let response = await this.get(address);
        if (typeof response.data === "string") {
            console.log("ERROR");;
            return [];
        } else {
            let devices : Device[] = await Promise.all(response.data.map(async (device_data: {'id': string, 'device': any}) => {
                return await load_device(device_data.id, device_data.device);
            }));
            return devices;
        }
    }

    async load_valueHistory(valueHistory_id: string) {
        let address : string = this.domain + "value_history/" + valueHistory_id;

        return new Promise<ValueHistory>((resolve, reject) => {
            this.get(address).then(response => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject();
                } else resolve(load_valueHistory(valueHistory_id, response.data));
            });
        });
    }

    // ================ SPECIFIC REQUESTS : POSTS  ================

    async create_new_user(name: string, email: string, password: string) : Promise<User | undefined> {

        // Register New User
        let user = await firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
            return userCredential.user;
        }).catch((error) => {
            console.log(error);
            return null;
        });

        if (user == null) return undefined;

        // Request to save user on database
        let address : string = this.domain + 'user/';
        let body = {'name': name, 'id': user.uid};

        return new Promise<User>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject;
                } else {
                    resolve(load_user(response.data.id, response.data.object));
                }
            });
        });
    }

    async create_new_house(user_id: string, house_data: { 'name': string }) {
        let address : string = this.domain + 'house/';
        let body = {'name': house_data.name, 'user_id': user_id};

        return new Promise<House>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject;
                } else {
                    resolve(load_house(response.data.id, response.data.object));
                }
            });
        });
    }

    async create_new_floor(house_id: string, floor_data: { 'name': string }) {
        let address : string = this.domain + 'floor/';
        let body = {'name': floor_data.name, 'house_id': house_id};

        return new Promise<Floor>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject;
                } else {
                    resolve(load_floor(response.data.id, response.data.object));
                }
            });
        });
    }

    async create_new_division(floor_id: string, division_data: { 'name': string }) {
        let address : string = this.domain + 'division/';
        let body = {'name': division_data.name, 'floor_id': floor_id};

        return new Promise<Division>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject;
                } else {
                    resolve(load_division(response.data.id, response.data.object));
                }
            });
        });
    }

    async create_new_device(division_id: string, device_data: {'name': string, 'favorite': boolean, 'deviceType_id': string, 'propertyValues': {'property_id': string, 'value': number }[]}) {
        let address : string = this.domain + 'device/';
        let body = {
            'name': device_data.name,
            'division_id': division_id,
            'deviceType_id': device_data.deviceType_id,
            'favorite': device_data.favorite,
            'propertyValues': device_data.propertyValues,
        };

        return new Promise<Device>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject;
                } else {
                    resolve(load_device(response.data.id, response.data.object));
                }
            });
        });
    }

    // ================ SPECIFIC REQUESTS : CHANGES  ================

    async add_favorites(device_id: string) {
        let address : string = this.domain + "favorites/" + device_id;

        return new Promise<void>((resolve, reject) => {
            this.post(address, {}).then(() => {
                resolve();
            });
        });
    }

    async remove_favorites(device_id: string) {
        let address : string = this.domain + "favorites/" + device_id;

        return new Promise<void>((resolve, reject) => {
            this.delete(address).then(() => {
                resolve();
            });
        });
    }

    async change_property_value(propertyValue_id: string, new_value: number) : Promise<string> {
        let address : string = this.domain + "property_value/";
        let body = { 'propertyValue_id': propertyValue_id, 'value': new_value };

        return new Promise<string>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");;
                    reject();
                } else {
                    resolve(response.data['new_id']);
                }
            });
        });
    }

    async add_house_to_user(house_id: string, user_email: string) : Promise<House> {
        let address : string = this.domain + "house/" + house_id + "/user";
        let body = { 'user_email': user_email };

        return new Promise<House>((resolve, reject) => {
            this.post(address, body).then((response) => {
                if (typeof response.data === "string") {
                    console.log("ERROR");
                    reject;
                } else resolve(load_house(house_id, response.data));
            });
        });
    }

    // ================ SPECIFIC REQUESTS : GET LOGGED USER & LOGOUT  ================

    get_user_logged_in() : firebase.User | undefined {
        let user = firebase.auth().currentUser;
        if (user == null) return undefined;
        else return user;
    }

    async logout() : Promise<void> {
        // Register New User
        await firebase.auth().signOut()
        return;
    }
}

export default new RouterAPI("http://localhost:8000/");