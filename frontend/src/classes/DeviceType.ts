export class DeviceType {
    id: string;
    name: string;
    paths_properties: string[];

    constructor(id: string, name: string, paths_properties: string[]) {
        this.id = id;this.name = name;
        this.paths_properties = paths_properties;
    }
}

export function load_deviceType(id: string, data : {name: string, paths_properties: string[]}) : DeviceType {
    let new_deviceType = new DeviceType(id, data.name, data.paths_properties);

    return new_deviceType;
}