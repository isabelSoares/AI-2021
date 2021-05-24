import React from 'react';
import moment from 'moment';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { Preference } from '@/classes/Preference';
import { Device } from '@/classes/Device';
import { Property } from '@/classes/Property';

import '@/general.scss';

// Definition of State and Props
type AddPreferenceDialogProps = {
    devices: Device[],
    // Functions
    save_function: (data: {
        'name': string,
        'properties': {'device': string, 'property': string, 'value': number}[],
        'schedules': {'timestamp': string}[] 
    }) => Promise<void>,
    close_function: () => void,
}

type AddPreferenceDialogState = {
    preference_name: string | undefined,
    propertyValues: {'device': Device | undefined, 'property': Property | undefined, 'value': number | undefined}[],
    schedules: moment.Moment[],
}

class AddPreferenceDialog extends React.Component<AddPreferenceDialogProps, AddPreferenceDialogState> {
    constructor(props: AddPreferenceDialogProps) {
        super(props);

        this.state = {
            preference_name: undefined,
            propertyValues: [],
            schedules: [],
        }
    }

    render() {
        return (
            <div className="PreferenceDialog">
                <div>
                    <div className="PreferenceHeader">
                        <p className="ComponentName"> New Preference </p>
                    </div>
                    <div className="PreferenceContent">
                        <TextField className="PreferenceInput TextField Name" onChange={this._handleTextFieldChange} 
                            id="name" label="Preference Name" size="medium"
                            defaultValue={this.state.preference_name} />
                    </div>
                    <Divider />
                    <div className="PreferenceProperties">
                        {this.state.propertyValues.map((preferenceProperty, index) => {
                            return (
                                <div className="Property" key={index}>
                                    <div className="MainPart">
                                        <div className="PropertyComponent PropertyDevice">
                                            <TextField className="PropertyInput PropertyValueInput" required id="device"
                                                size="small" name={preferenceProperty.device?.id} select label="Device"
                                                defaultValue={preferenceProperty.device?.id} onChange={(e) => this._handleSelectProperty(index, 'device', e)}>
                                                {this.props.devices.map(device => {
                                                    return (
                                                        <MenuItem key={device.id} value={device.id}>
                                                            {device.name}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </TextField>
                                        </div>
                                        {preferenceProperty.device != undefined &&
                                            <div className="PropertyComponent PropertyProperty">
                                                <TextField className="PropertyInput PropertyValueInput" required id="property"
                                                    size="small" name={preferenceProperty.property?.id} select label="Property"
                                                    defaultValue={preferenceProperty.property?.id} onChange={(e) => this._handleSelectProperty(index, 'property', e)}>
                                                    {this.props.devices.find(device => device.id == preferenceProperty.device?.id)?.propertyValues?.map(propertyValue => {
                                                        return (
                                                            <MenuItem key={propertyValue.property?.id} value={propertyValue.property?.id}>
                                                                {propertyValue.property?.name}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </TextField>
                                            </div>
                                        }
                                        {preferenceProperty.property?.type.type == "Enumerator" &&
                                            <div className="PropertyComponent PropertyValue Enumerator">
                                                <TextField className="PropertyInput PropertyValueInput" required id="enumeratorValue"
                                                    size="small" name={preferenceProperty.property?.id} select label="Value"
                                                    defaultValue={preferenceProperty.value} onChange={(e) => this._handleSelectProperty(index, 'value', e)}>
                                                    {preferenceProperty.property?.type.get_values().map(value => {
                                                        return (
                                                            <MenuItem key={value.key} value={value.key}>
                                                                {value.value}
                                                            </MenuItem>
                                                        )
                                                    })}   
                                                </TextField>
                                            </div>
                                        }
                                        {preferenceProperty.property?.type.type == "Scalar" &&
                                            <div className="PropertyComponent PropertyValue Scalar">
                                                <TextField className="PropertyInput PropertyValueInput" required id={preferenceProperty.property.id} size="small"
                                                defaultValue={preferenceProperty.value} label="Value" onChange={(e) => this._handleTextFieldProperty(index, e)} />
                                                <p className="PropertyUnits">{preferenceProperty.property.type.get_units()}</p>
                                            </div>
                                        }
                                    </div>
                                    <IconButton color="primary" component="span" onClick={() => this._handleDeletePropertyValue(index)}>
                                        <DeleteIcon className="Icon DeleteIcon"/>
                                    </IconButton>
                                </div>
                            )
                        })}
                        <div className="ButtonsGroup">
                            <IconButton color="primary" component="span" onClick={this._handleCreatePropertyValue}>
                                <AddBoxIcon className="Icon AddBoxIcon"/>
                            </IconButton>
                        </div>
                    </div>
                    <Divider />
                    <div className="Schedules">
                        {this.state.schedules.map((schedule, index) => {
                            return (
                                <div className="Schedule" key={index}>
                                    <TextField className="PreferenceInput TextField Schedule" onChange={(e) => this._handleSelectSchedule(index, e)}
                                        label="Schedule To" type="time" defaultValue={schedule.format("HH:mm")}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <IconButton color="primary" component="span" onClick={() => this._handleDeleteSchedule(index)}>
                                        <DeleteIcon className="Icon DeleteIcon"/>
                                    </IconButton>
                                </div>
                            )
                        })}
                        <div className="ButtonsGroup">
                            <IconButton color="primary" component="span" onClick={this._handleCreateSchedule}>
                                <AddBoxIcon className="Icon AddBoxIcon"/>
                            </IconButton>
                        </div>
                    </div>
                    <Divider />
                    <div className="Buttons">
                        <Button className="Button SaveButton"
                            variant="contained" color="default" size="small"
                            onClick={this.save_state} disabled={this._checkDisabledSaving()}
                        >
                            Save New Preference
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let id = e.target.id;
            let value = e.target.value;

            switch (id) {
                case 'name':
                    this.setState(state => ({ preference_name: value }));
                    break;
            }
        }
    }

    _handleSelectProperty = async (index: number, type: string, e: React.ChangeEvent<{ value: string }>) => {
        if (e.currentTarget instanceof Element) {
            let newValue = e.target.value;
            let propertyValues = this.state.propertyValues;

            if (type == 'device') {
                let device = this.props.devices.find(device => device.id == newValue);
                if (device == undefined) return;
                await device.full_load();

                propertyValues[index].device = device;
                propertyValues[index].property = undefined;

            } else if (type == 'property') {
                let device = propertyValues[index].device;
                if (device == undefined) return;

                let propertyValue = device.propertyValues?.find(propertyValue => propertyValue.property?.id == newValue);
                if (propertyValue == undefined) return;

                propertyValues[index].property = propertyValue.property;
                propertyValues[index].value = undefined;

            } else if (type == 'value') {
                propertyValues[index].value = parseFloat(newValue);
            }

            this.setState(state => ({ propertyValues: propertyValues }));
        }
    }

    _handleTextFieldProperty = async (index: number, e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let value = parseFloat(e.target.value);
            let propertyValues = this.state.propertyValues;

            propertyValues[index].value = value;
            this.setState(state => ({ propertyValues: propertyValues }));
        }
    }

    _handleSelectSchedule = (index: number, e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let value = e.target.value;
            let schedules = this.state.schedules;

            schedules[index] = moment(value, "HH:mm");
            this.setState(state => ({ schedules: schedules }));
        }
    }

    // ============================== CHECK EVENTS ==============================

    _checkDisabledSaving = () => {
        if (this.state.preference_name == undefined) return true;
        let filteredPropertyValues = this.state.propertyValues
            .filter(elem => elem.device != undefined && elem.property != undefined && elem.value != undefined)
            .filter((item): item is {'device': Device, 'property': Property, 'value': number} => !!item);

        if (filteredPropertyValues.length == 0) return true;

        return false;
    }

    _handleDeletePropertyValue = (propertyIndex: number) => {
        this.setState(state => ({
            propertyValues: state.propertyValues.filter((_, index) => index != propertyIndex),
        }));
    }

    _handleDeleteSchedule = (scheduleIndex: number) => {
        this.setState(state => ({
            schedules: state.schedules.filter((_, index) => index != scheduleIndex),
        }));
    }

    _handleCreatePropertyValue = () => {
        let newProperty = {'device': undefined, 'property': undefined, 'value': undefined}
        let oldProperties = this.state.propertyValues;
        oldProperties.push(newProperty);

        this.setState(state => ({
            propertyValues: oldProperties,
        }));
    }

    _handleCreateSchedule = () => {
        let newSchedule = moment().hour(0).minute(0).second(0).millisecond(0);
        let oldSchedules = this.state.schedules;
        oldSchedules.push(newSchedule);

        this.setState(state => ({
            schedules: oldSchedules,
        }));
    }

    // ============================== SAVE STATE ==============================

    save_state = async () => {

        if (this.state.preference_name == undefined) return;
        let filteredPropertyValues = this.state.propertyValues
            .filter(elem => elem.device != undefined && elem.property != undefined && elem.value != undefined)
            .filter((item): item is {'device': Device, 'property': Property, 'value': number} => !!item);

        let data = {
            'name': this.state.preference_name,
            'schedules': this.state.schedules.map(elem => { return { 'timestamp': elem.toISOString() }} ),
            'properties': filteredPropertyValues.map(elem => { return {
                'device': elem.device.id,
                'property': elem.property.id,
                'value': elem.value
            }}),
        }

        await this.props.save_function(data);
        this.props.close_function();
    }
}

export default AddPreferenceDialog;