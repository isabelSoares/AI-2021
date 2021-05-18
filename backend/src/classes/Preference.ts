export class Preference {
    name: string;
    pendent: boolean;
    paths_propertyValues: string[];
    paths_schedules: string[];
    path_user: string;

    constructor(name: string, pendent: boolean, paths_propertyValues: string[], paths_schedules: string[], path_user: string) {
        this.name = name;
        this.pendent = pendent;
        this.paths_propertyValues = paths_propertyValues;
        this.paths_schedules = paths_schedules;
        this.path_user = path_user;
    }
}

export function load_preference(data : FirebaseFirestore.DocumentData) : Preference {
    let name : string = data['name'];
    let pendent : boolean = data['pendent'];
    let paths_to_propertyValues : string[] = data['propertyValues'].map((propertyValue : any) => propertyValue['_path']['segments'].join('/'));
    let paths_to_schedules : string[] = data['schedules'].map((schedule : any) => schedule['_path']['segments'].join('/'));
    let path_to_user : string = data['user']['_path']['segments'].join('/');
    let new_preference = new Preference(name, pendent, paths_to_propertyValues, paths_to_schedules, path_to_user);

    return new_preference;
}