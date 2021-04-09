export class DeviceType {
    name: string;
    paths_properties: string[];

    constructor(name: string, paths_properties: string[]) {
        this.name = name;
        this.paths_properties = paths_properties;
    }
}

export function load_device_type(data : FirebaseFirestore.DocumentData) : DeviceType {
    let name : string = data['name'];
    let paths_to_properties : string[] = data['properties'].map((device : any) => device['_path']['segments'].join('/'));
    let new_deviceType = new DeviceType(name, paths_to_properties);

    return new_deviceType;
}