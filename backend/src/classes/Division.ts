export class Division {
    name: string;
    path_floor: string;
    paths_devices: string[];

    constructor(name: string, path_floor: string, paths_devices: string[]) {
        this.name = name;
        this.path_floor = path_floor;
        this.paths_devices = paths_devices;
    }
}

export function load_division(data : FirebaseFirestore.DocumentData) : Division {
    let name : string = data['name'];
    let path_floor : string = data['floor']['_path']['segments'].join('/');
    let paths_to_devices : string[] = data['devices'].map((device : any) => device['_path']['segments'].join('/'));
    let new_division = new Division(name, path_floor, paths_to_devices);

    return new_division;
}