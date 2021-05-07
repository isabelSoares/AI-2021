export class Division {
    id: string;
    name: string;
    paths_devices: string[];

    constructor(id: string, name: string, paths_devices: string[]) {
        this.id = id;
        this.name = name;
        this.paths_devices = paths_devices;
    }
}

export function load_division(id: string, data : {name: string, paths_devices: string[]}) : Division {
    let new_division = new Division(id, data.name, data.paths_devices);

    return new_division;
}