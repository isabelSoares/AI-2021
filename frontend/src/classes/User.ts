import { House } from '@/classes/House';
import { Floor } from '@/classes/Floor';
import { Division } from '@/classes/Division';
import { Device } from '@/classes/Device';

import Router from '@/utils/endpointAPI';

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
        this.houses = [];
        
        await Promise.all(this.paths_houses.map(async (path_to_house) => {
            let house_id = path_to_house.replace("houses/", "");
            let house = await Router.load_house(house_id);

            this.houses?.push(house);
        }));
    }

    async load_floors() {
        if (this.paths_floors == undefined) return;
        this.floors = [];
        
        await Promise.all(this.paths_floors.map(async (path_to_floor) => {
            let floor_id = path_to_floor.replace("floors/", "");
            let floor = await Router.load_floor(floor_id);

            this.floors?.push(floor);
        }));
    }
    
    async load_divisions() {
        if (this.paths_divisions == undefined) return;
        this.divisions = [];
        
        await Promise.all(this.paths_divisions.map(async (path_to_house) => {
            let division_id = path_to_house.replace("divisions/", "");
            let division = await Router.load_division(division_id);

            this.divisions?.push(division);
        }));
    }

    async load_devices() {
        if (this.paths_devices == undefined) return;
        this.devices = []; this.devices = [];
        
        await Promise.all(this.paths_devices.map(async (path_to_device) => {
            let device_id = path_to_device.replace("devices/", "");
            let device = await Router.load_device(device_id);

            this.devices?.push(device);
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