export class User {
    name: string;
    paths_houses: string[];

    constructor(name: string, paths_houses: string[]) {
        this.name = name;
        this.paths_houses = paths_houses;
    }
}

export function load_user(data : {name: string, paths_houses: string[]}) : User {
    let new_user = new User(data.name, data.paths_houses);

    return new_user;
}