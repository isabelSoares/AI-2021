export class Floor {
    id: string;
    name: string;
    paths_divisions: string[];

    constructor(id: string, name: string, paths_divisions: string[]) {
        this.id = id;
        this.name = name;
        this.paths_divisions = paths_divisions;
    }
}

export function load_floor(id: string, data : {name: string, paths_divisions: string[]}) : Floor {
    let new_floor = new Floor(id, data.name, data.paths_divisions);

    return new_floor;
}