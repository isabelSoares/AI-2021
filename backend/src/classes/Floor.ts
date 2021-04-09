export class Floor {
    name: string;
    path_house: string;
    paths_divisions: string[];

    constructor(name: string, path_house: string, paths_divisions: string[]) {
        this.name = name;
        this.path_house = path_house;
        this.paths_divisions = paths_divisions;
    }
}

export function load_floor(data : FirebaseFirestore.DocumentData) : Floor {
    let name : string = data['name'];
    let path_to_house : string = data['house']['_path']['segments'].join('/');
    let paths_to_divisions : string[] = data['divisions'].map((division : any) => division['_path']['segments'].join('/'));
    let new_floor = new Floor(name, path_to_house, paths_to_divisions);

    return new_floor;
}