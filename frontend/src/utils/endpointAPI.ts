import axios, {AxiosResponse} from 'axios';

import { PropertyValue, load_propertyValue } from '@/classes/PropertyValue';
import { DeviceType, load_deviceType } from '@/classes/DeviceType';
import { Property, load_property } from '@/classes/Property';
import { Division, load_division } from '@/classes/Division';
import { Device, load_device } from '@/classes/Device';
import { Floor, load_floor } from '@/classes/Floor';
import { House, load_house } from '@/classes/House';

class RouterAPI {
    domain: string;

    constructor(domain: string) {
        this.domain = domain;
    }

    // ================ GENERAL REQUESTS ================
    async get(address: string) : Promise<AxiosResponse<any>> {
        return axios.get(address);
    }
    
    // ================ SPECIFIC REQUESTS ================
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
}

export default new RouterAPI("http://localhost:8000/");