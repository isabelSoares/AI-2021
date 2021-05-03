import axios from 'axios';

import { House, load_house } from '@/classes/House';

export class User {
    id: string;
    name: string;
    paths_houses: string[];
    // To Be Loaded
    houses: House[] | undefined;

    constructor(id: string, name: string, paths_houses: string[]) {
        this.id = id;
        this.name = name;
        this.paths_houses = paths_houses;

        // To Be Loaded
        this.houses = undefined;
    }

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

        console.log(this.houses);
    }
}

export function load_user(id: string, data : {name: string, paths_houses: string[]}) : User {
    let new_user = new User(id, data.name, data.paths_houses);

    return new_user;
}