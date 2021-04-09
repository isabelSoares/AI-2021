export class PropertyValue {
    path_device: string;
    path_property: string;
    value: number;

    constructor(path_device: string, path_property: string, value: number) {
        this.path_device = path_device;
        this.path_property = path_property;
        this.value = value;
    }
}
    
export function load_propertyValue(data : FirebaseFirestore.DocumentData) : PropertyValue {
    let path_to_device : string = data['device']['_path']['segments'].join('/');
    let path_to_property : string = data['property']['_path']['segments'].join('/');
    let value : number = data['value'];
    let new_propertyValue = new PropertyValue(path_to_device, path_to_property, value);

    return new_propertyValue;
}