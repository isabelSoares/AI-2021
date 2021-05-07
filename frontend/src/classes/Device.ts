export class Device {
    id: string;
    name: string;
    favorite : boolean;
    path_deviceType: string;
    paths_propertyValues: string[];

    constructor(id: string, name: string, favorite: boolean, path_deviceType: string, paths_propertyValues: string[]) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.path_deviceType = path_deviceType;
        this.paths_propertyValues = paths_propertyValues;
    }
}

export function load_device(id: string, data : {name: string, favorite: boolean, paths_deviceType: string, paths_propertyValues: string[]}) : Device {
    let new_device = new Device(id, data.name, data.favorite, data.paths_deviceType , data.paths_propertyValues);

    return new_device;
}