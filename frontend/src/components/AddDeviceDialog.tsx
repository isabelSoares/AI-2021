import React from 'react';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import {Device} from '@/classes/Device';
import {Property} from '@/classes/Property';
import {DeviceType} from '@/classes/DeviceType';

import Router from '@/utils/endpointAPI';

import '@/general.scss';

// Definition of State and Props
type AddDeviceDialogProps = {
    close_function: () => void,
    save_function: (new_device_data: {'name': string, 'favorite': boolean, 'deviceType_id': string, 'propertyValues': {'property_id': string, 'value': number }[]}) => Promise<void>
}

type AddDeviceDialogState = {
    name: string | undefined,
    favorite: boolean | undefined,
    deviceType: DeviceType | undefined,
    propertiesValues: {'property': Property, 'value': number | undefined}[],
    // Options
    possibleDeviceTypes: DeviceType[],
    // Checks
    invalid_inputs: string[],
}

class AddDeviceDialog extends React.Component<AddDeviceDialogProps, AddDeviceDialogState> {
    constructor(props: AddDeviceDialogProps) {
        super(props);

        this.state = {
            favorite: undefined,
            name: undefined,
            deviceType: undefined,
            propertiesValues: [],
            // Options
            possibleDeviceTypes: [],
            // Checks
            invalid_inputs: [],
        }
    }

    async componentDidMount() {
        let deviceTypes = await Router.load_deviceTypes();
        this.setState(state => ({ possibleDeviceTypes: deviceTypes }));
    }

    render() {
        return (
            <div className="AddDeviceDialog">
                <div className="AddDeviceHeader">
                    <p className="ComponentName"> New Device </p>
                </div>
                <div className="AddDeviceContent">
                    <TextField className="AddDeviceInput TextField Name Line1" onChange={this._handleTextFieldChange} 
                        required id="name" label="Device Name" size="medium"
                        defaultValue=""/>
                    <div className="Line">
                        <TextField className="AddDeviceInput SelectField Favorite Line2" onChange={this._handleSelectFieldChange} 
                            required id="favorite" label="Favorite" size="medium" select
                            defaultValue="">
                                <MenuItem id='favorite' key="Favorite" value={"true"}> Favorited </MenuItem>
                                <MenuItem id='favorite' key="Not-Favorite" value={"false"}> Not Favorited </MenuItem>
                        </TextField>
                        <TextField className="AddDeviceInput SelectField DeviceType Line2" onChange={this._handleSelectFieldChange} 
                            required id="deviceType" label="Device Type" size="medium" select
                            defaultValue="">
                                {this.state.possibleDeviceTypes.map((deviceType) => (
                                    <MenuItem id='deviceType' key={deviceType.id} value={deviceType.id}>
                                        {deviceType.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                </div>
                <Divider />
                <div className="AddDeviceProperties">
                    {this.state.deviceType != undefined && this.state.deviceType.properties?.map((property) => {
                        return (
                            <div className="AddDeviceProperty" key={property.id}>
                                <div className="PropertyHeader">
                                    <p className="PropertyName">{property.name}</p>
                                    {property.type.type == "Enumerator" && <p className="PropertyType">{property.type.format()}</p>}
                                    {property.type.type == "Scalar" && <p className="PropertyType">{property.type.format()}</p>}
                                </div>
                                {property.type.type == "Enumerator" &&
                                    <div className="PropertyValue Enumerator">
                                        <TextField className="PropertyValueInput" onChange={this._handleSelectFieldChange}
                                            required id="enumeratorValue"label="Value"size="small" name={property.id} select
                                            defaultValue=""
                                        >
                                            {property.type.get_values().map((value) => (
                                                <MenuItem id={property.id} key={value.key} value={value.key}>
                                                    {value.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                }
                                {property.type.type == "Scalar" &&
                                    <div className="PropertyValue Scalar">
                                        <TextField className="PropertyValueInput" onChange={this._handleTextFieldChange} 
                                            required id={property.id} label="Value" size="small"
                                            error={this.state.invalid_inputs.includes(property.id)} />
                                        <p className="PropertyUnits">{property.type.get_units()}</p>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                {this.state.deviceType != undefined && this.state.deviceType.properties != undefined && this.state.deviceType.properties.length >= 1 && <Divider /> }
                <div className="Buttons">
                    <Button className="Button SaveButton"
                        variant="contained" color="default" size="small"
                        disabled={this._checkValidSave()}
                        onClick={() => this._handleSaveChanges()}
                        >
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let id = e.target.id;
            let value = e.target.value;

            switch (e.target.id) {
                case 'name':
                    this.setState(state => ({ name: value == "" ? undefined : value }))
                    break;

                default:
                    let valueParsed = parseFloat(value);

                    // Retrieve Property
                    let new_propertiesValues = this.state.propertiesValues;
                    let propertyToChange = new_propertiesValues.find((element) => element.property.id == id);
                    if (propertyToChange == undefined) break;

                    let valid;
                    if (valueParsed == NaN) valid = false; 
                    else valid = propertyToChange.property.type.check_valid_value(valueParsed);

                    propertyToChange.value = valid ? valueParsed : undefined;
                    this.setState(state => ({ propertiesValues: new_propertiesValues }));

        
                    if (valid && this.state.invalid_inputs.includes(id)) {
                        let new_invalid_inputs = this.state.invalid_inputs.filter((elem) => elem != id);
                        this.setState(state => ({ invalid_inputs: new_invalid_inputs }));
                    } else if (!valid && ! this.state.invalid_inputs.includes(id)) {
                        this.setState(state => ({ invalid_inputs: state.invalid_inputs.concat([id]) }))
                    }
            }
        }
    }

    _handleSelectFieldChange = async (e: React.ChangeEvent<{ value: string }>) => {
        if (e.currentTarget instanceof Element) {
            let targetId = e.currentTarget.id;
            let newValue = e.target.value;

            switch (targetId) {
                case 'favorite':
                    this.setState(state => ({ favorite: newValue == "true" }));
                    break;
                
                case 'deviceType':
                    let deviceType = this.state.possibleDeviceTypes.find((element) => element.id == newValue);
                    if (deviceType == undefined) break;

                    // Save and Load device Type
                    await deviceType.load_properties();
                    this.setState(state => ({ deviceType: deviceType }));
                    
                    // Save and Load properties Value
                    if (this.state.deviceType == undefined || this.state.deviceType.properties == undefined) break;
                    let new_properties = this.state.deviceType.properties.map((property) => {
                        return {'property': property, 'value': undefined}
                    });
                    this.setState(state => ({ propertiesValues: new_properties }));
                    
                    break;

                default:
                    let valueParsed = parseFloat(newValue);
                    let new_propertiesValues = this.state.propertiesValues;
                    let propertyToChange = new_propertiesValues.find((element) => element.property.id == targetId);
                    if (propertyToChange == undefined) break;
                    propertyToChange.value = valueParsed;
                    this.setState(state => ({ propertiesValues: new_propertiesValues }));
            }
        }
    }

    _handleSaveChanges = async () => {
            if (this.state.name == undefined) return;
            if (this.state.favorite == undefined) return;
            if (this.state.deviceType == undefined) return;

            let propertyValuesData : {'property_id': string, 'value': number}[] = []
            this.state.propertiesValues.forEach((elem) => {
                if (elem.value != undefined) propertyValuesData.push({'property_id': elem.property.id, 'value': elem.value})
            });
    
            let new_deviceData = {
                'name': this.state.name,
                'favorite': this.state.favorite,
                'deviceType_id': this.state.deviceType.id,
                'propertyValues': propertyValuesData,
            }
    
            await this.props.save_function(new_deviceData);
            this.props.close_function();
    }

    // ============================== CHECK EVENTS ==============================

    _checkValidSave = () => {
        
        if (this.state.name == undefined) return true;
        else if (this.state.deviceType == undefined) return true;
        else if (this.state.favorite == undefined) return true;

        let propertiesValid = true;
        this.state.propertiesValues.forEach((property) => {
            if (property.value == undefined) propertiesValid = false;
            else if (!property.property.type.check_valid_value(property.value)) propertiesValid = false;
        });

        if (!propertiesValid) return true;

        return false;
    }
}

export default AddDeviceDialog;