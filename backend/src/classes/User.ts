export class User {
    name: string;
    paths_houses: string[];

    constructor(name: string, paths_houses: string[]) {
        this.name = name;
        this.paths_houses = paths_houses;
    }
}

export function load_user(data : FirebaseFirestore.DocumentData) : User {
    let name : string = data['name'];
    let paths_to_houses : string[] = data['houses'].map((house : any) => house['_path']['segments'].join('/'));
    let new_user = new User(name, paths_to_houses);

    return new_user;
}