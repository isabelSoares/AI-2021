export class House {
    name: string;
    paths_users: string[];
    paths_floors: string[];

    constructor(name: string, paths_users: string[], paths_floors: string[]) {
        this.name = name;
        this.paths_users = paths_users;
        this.paths_floors = paths_floors;
    }
}

export function load_house(data : FirebaseFirestore.DocumentData) : House {
    let name : string = data['name'];
    let paths_to_users : string[] = data['users'].map((user : any) => user['_path']['segments'].join('/'));
    let paths_to_floors : string[] = data['floors'].map((floor : any) => floor['_path']['segments'].join('/'));
    let new_house = new House(name, paths_to_users, paths_to_floors)

    return new_house;
}