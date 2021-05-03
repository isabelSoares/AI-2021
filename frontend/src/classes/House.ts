export class House {
    id: string;
    name: string;
    paths_floors: string[];

    constructor(id: string, name: string, paths_floors: string[]) {
        this.id = id;
        this.name = name;
        this.paths_floors = paths_floors;
    }
}

export function load_house(id: string, data : {name: string, paths_floors: string[]}) : House {
    let new_house = new House(id, data.name, data.paths_floors);

    return new_house;
}