export class Device {
    name: string;
    favorite : boolean;
    path_deviceType: string;
    path_division: string;
    paths_propertyValues: string[];
    paths_valuesHistory: string[];

    constructor(name: string, favorite: boolean, path_deviceType: string, path_division: string, paths_propertyValues: string[], paths_valuesHistory: string[]) {
        this.name = name;
        this.favorite = favorite;
        this.path_deviceType = path_deviceType;
        this.path_division = path_division;
        this.paths_propertyValues = paths_propertyValues;
        this.paths_valuesHistory = paths_valuesHistory;
    }
}

export function load_device(data : FirebaseFirestore.DocumentData) : Device {
    let name : string = data['name'];
    let favorite : boolean = data['favorite'];
    let path_to_deviceType : string = data['deviceType']['_path']['segments'].join('/');
    let paths_to_division : string = data['division']['_path']['segments'].join('/');
    let paths_to_propertyValues : string[] = data['propertyValues'].map((propertyValue : any) => propertyValue['_path']['segments'].join('/'));
    let paths_to_valuesHistory : string[] = data['valuesHistory'].map((valueHistory : any) => valueHistory['_path']['segments'].join('/'));
    let new_device = new Device(name, favorite, path_to_deviceType, paths_to_division, paths_to_propertyValues, paths_to_valuesHistory);

    return new_device;
}