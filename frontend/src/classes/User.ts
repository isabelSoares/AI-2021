import { House } from '@/classes/House';
import { Floor } from '@/classes/Floor';
import { Division } from '@/classes/Division';
import { Device } from '@/classes/Device';
import { Preference } from '@/classes/Preference';

import Router from '@/utils/endpointAPI';

export class User {
    id: string;
    name: string;
    paths_preferences: string[];
    paths_houses: string[];
    // To Be Loaded
    preferences: Preference[] | undefined;
    houses: House[] | undefined;
    floors: Floor[] | undefined;
    divisions: Division[] | undefined;
    devices: Device[] | undefined;
    favorites: Device[] | undefined;
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

    constructor(id: string, name: string, paths_preferences: string[], paths_houses: string[]) {
        this.id = id;
        this.name = name;
        this.paths_preferences = paths_preferences;
        this.paths_houses = paths_houses;
        
        // To Be Loaded
        this.preferences = undefined;
        this.houses = undefined;
        this.floors = undefined;
        this.divisions = undefined;
        this.devices = undefined;
        this.favorites = undefined;
        
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

    async load_preferences() {
        this.preferences = [];
        
        await Promise.all(this.paths_preferences.map(async (path_to_preference) => {
            let preference_id = path_to_preference.replace("preferences/", "");
            let preference = await Router.load_preference(preference_id);

            this.preferences?.push(preference);
        }));
    }

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
        this.devices = [];
        
        await Promise.all(this.paths_devices.map(async (path_to_device) => {
            let device_id = path_to_device.replace("devices/", "");
            let device = await Router.load_device(device_id);

            this.devices?.push(device);
        }));
    }

    async load_favorites() {
        this.favorites = await Router.load_favorites(this.id);
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

    // ==================== CREATE OBJECTS ====================

    async add_new_house(house_data : {'name': string}) {
        let newHouse = await Router.create_new_house(this.id, house_data);
        this.houses?.push(newHouse);

        // Add to path correspondent
        let pathHouse = "houses/" + newHouse.id;
        this.paths_houses.push(pathHouse);
    }
    async add_new_floor(floor_data : {'name': string}) {
        if (this.house_id_selected == undefined) return;
        let newFloor = await Router.create_new_floor(this.house_id_selected, floor_data);
        this.floors?.push(newFloor);

        // Add to path correspondent
        let pathFloor = "floors/" + newFloor.id;
        this.house_selected?.paths_floors.push(pathFloor);
    }

    async add_new_division(division_data : {'name': string}) {
        if (this.floor_id_selected == undefined) return;
        let newDivision = await Router.create_new_division(this.floor_id_selected, division_data);
        this.divisions?.push(newDivision);

        // Add to path correspondent
        let pathDivision = "divisions/" + newDivision.id;
        this.floor_selected?.paths_divisions.push(pathDivision);
    }
    
    async add_new_device(device_data : {'name': string, 'favorite': boolean, 'deviceType_id': string, 'propertyValues': {'property_id': string, 'value': number }[]}) {
        if (this.division_id_selected == undefined) return;
        let newDevice = await Router.create_new_device(this.division_id_selected, device_data);
        this.devices?.push(newDevice);

        // Add to path correspondent
        let pathDevice = "devices/" + newDevice.id;
        this.division_selected?.paths_devices.push(pathDevice);
    }
}

export function load_user(id: string, data : {name: string, paths_preferences: string[], paths_houses: string[]}) : User {
    let new_user = new User(id, data.name, data.paths_preferences, data.paths_houses);
    
    return new_user;
}