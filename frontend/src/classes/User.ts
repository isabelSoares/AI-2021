import axios from 'axios';

import { House, load_house } from '@/classes/House';
import { Floor, load_floor } from '@/classes/Floor';
import { Division, load_division } from '@/classes/Division';
import { Device, load_device } from '@/classes/Device';

export class User {
    id: string;
    name: string;
    paths_houses: string[];
    // To Be Loaded
    houses: House[] | undefined;
    floors: Floor[] | undefined;
    divisions: Division[] | undefined;
    devices: Device[] | undefined;
    // Selections
    house_id_selected: string | undefined;
    house_selected: House | undefined;
    paths_floors: string[] | undefined;
    floor_id_selected: string | undefined;
    floor_selected: Floor | undefined;
    paths_divisions: string[] | undefined;
    division_id_selected: string | undefined;
    division_selected: Division | undefined;
    paths_devices: string[] | undefined;

    constructor(id: string, name: string, paths_houses: string[]) {
        this.id = id;
        this.name = name;
        this.paths_houses = paths_houses;
        
        // To Be Loaded
        this.houses = undefined;
        this.floors = undefined;
        this.divisions = undefined;
        this.devices = undefined;
        
        // Selections
        this.house_id_selected = undefined;
        this.house_selected = undefined;
        this.paths_floors = undefined;
        this.floor_id_selected = undefined;
        this.floor_selected = undefined;
        this.paths_divisions = undefined;
        this.division_id_selected = undefined;
        this.division_selected = undefined;
        this.paths_devices = undefined;
    }

    // ==================== LOAD OBJECTS ====================

    async load_houses() {
        let address : string = "http://localhost:8000/house/";
        this.houses = [];
        
        await Promise.all(this.paths_houses.map(async (path_to_house) => {
            let path_to_house_corrected = path_to_house.replace("houses/", "");
            let complete_address = address + path_to_house_corrected;
            const response = await axios.get(complete_address);

            if (typeof response.data === "string") {
                console.log("ERROR");
            } else this.houses?.push(load_house(path_to_house_corrected, response.data));
        }));
    }

    async load_floors() {
        if (this.paths_floors == undefined) return;

        let address : string = "http://localhost:8000/floor/";
        this.floors = [];
        
        await Promise.all(this.paths_floors.map(async (path_to_floor) => {
            let path_to_floor_corrected = path_to_floor.replace("floors/", "");
            let complete_address = address + path_to_floor_corrected;
            const response = await axios.get(complete_address);

            if (typeof response.data === "string") {
                console.log("ERROR");
            } else this.floors?.push(load_floor(path_to_floor_corrected, response.data));
        }));
    }
    
    async load_divisions() {
        if (this.paths_divisions == undefined) return;

        let address : string = "http://localhost:8000/division/";
        this.divisions = [];
        
        await Promise.all(this.paths_divisions.map(async (path_to_division) => {
            let path_to_division_corrected = path_to_division.replace("divisions/", "");
            let complete_address = address + path_to_division_corrected;
            const response = await axios.get(complete_address);

            if (typeof response.data === "string") {
                console.log("ERROR");
            } else this.divisions?.push(load_division(path_to_division_corrected, response.data));
        }));
    }

    async load_devices() {
        if (this.paths_devices == undefined) return;

        let address : string = "http://localhost:8000/device/";
        this.devices = [];
        
        await Promise.all(this.paths_devices.map(async (path_to_device) => {
            let path_to_device_corrected = path_to_device.replace("devices/", "");
            let complete_address = address + path_to_device_corrected;
            const response = await axios.get(complete_address);

            if (typeof response.data === "string") {
                console.log("ERROR");
            } else this.devices?.push(load_device(path_to_device_corrected, response.data));
        }));
    }

    // ==================== SELECTION OBJECTS ====================

    select_house(id: string) {
        // Clear current information
        this.floors = undefined;
        this.divisions = undefined;
        this.devices = undefined;
        // As well as
        this.floor_id_selected = undefined;
        this.floor_selected = undefined;
        this.paths_divisions = undefined;
        this.division_id_selected = undefined;
        this.division_selected = undefined;
        this.paths_devices = undefined;

        // Select house
        this.house_id_selected = id;
        this.house_selected = this.houses?.find(house => house.id == id);
        this.paths_floors = this.house_selected?.paths_floors;
    }

    select_floor(id: string) {
        // Clear current information
        this.divisions = undefined;
        this.devices = undefined;
        // As well as
        this.division_id_selected = undefined;
        this.division_selected = undefined;
        this.paths_devices = undefined;

        // Select floor
        this.floor_id_selected = id;
        this.floor_selected = this.floors?.find(floor => floor.id == id);
        this.paths_divisions = this.floor_selected?.paths_divisions;
    }

    select_division(id: string) {
        // Clear current information
        this.devices = undefined;

        // Select division
        this.division_id_selected = id;
        this.division_selected = this.divisions?.find(division => division.id == id);
        this.paths_devices = this.division_selected?.paths_devices;
    }
}

export function load_user(id: string, data : {name: string, paths_houses: string[]}) : User {
    let new_user = new User(id, data.name, data.paths_houses);

    return new_user;
}