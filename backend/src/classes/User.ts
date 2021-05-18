export class User {
    name: string;
    paths_houses: string[];
    paths_preferences: string[];

    constructor(name: string, paths_houses: string[], paths_preferences: string[]) {
        this.name = name;
        this.paths_houses = paths_houses;
        this.paths_preferences = paths_preferences;
    }
}

export function load_user(data : FirebaseFirestore.DocumentData) : User {
    let name : string = data['name'];
    let paths_to_houses : string[] = data['houses'].map((house : any) => house['_path']['segments'].join('/'));
    let paths_to_preferences : string[] = data['preferences'].map((preference : any) => preference['_path']['segments'].join('/'));
    let new_user = new User(name, paths_to_houses, paths_to_preferences);

    return new_user;
}