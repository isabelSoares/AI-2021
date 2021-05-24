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
type PreferenceDialogProps = {
    devices: Device[],
    preference: Preference | undefined,
    // Functions
    close_function: () => void,
}

type PreferenceDialogState = {
    preference_name: string | undefined,
    propertyValues: {'device': Device | undefined, 'property': Property | undefined, 'value': number | undefined}[],
    schedules: moment.Moment[],
}

class PreferenceDialog extends React.Component<PreferenceDialogProps, PreferenceDialogState> {
    constructor(props: PreferenceDialogProps) {
        super(props);

        this.state = {
            preference_name: this.props.preference?.name,
            propertyValues: [],
            schedules: [],
        }
    }

    async componentDidMount() {
        await this.props.preference?.full_load();

        if (!this.props.preference || !this.props.preference.propertyValues) {
            this.forceUpdate();
            return;
        }
        
        // Load Devices present in preference
        await Promise.all(this.props.preference.propertyValues.map(async (propertyValue) => {
            let device_id = propertyValue.device?.id;
            let device = this.props.devices.find(device => device.id == device_id);
            if (device == undefined) return;
            
            await device.full_load();
            return;
        }));
        
        // ========================== Name ==========================
        let name = this.props.preference.name;

        // ========================== Property Values ==========================
        // Load to format for state
        let propertyValues = this.props.preference.propertyValues.map(propertyValue => {
            let device_id = propertyValue.device?.id;
            let device = this.props.devices.find(device => device.id == device_id);
            if (device == undefined) return;
            
            let property = propertyValue.property;
            if (property == undefined) return;
            
            return {'device': device, 'property': property, 'value': propertyValue.value }
        }).filter(elem => elem != undefined && elem.device != undefined && elem.property != undefined && elem.value != undefined)
            .filter((item): item is {'device': Device, 'property': Property, 'value': number} => !!item);

        // ========================== Schedules ==========================

        let schedules = this.props.preference.schedules?.map(schedule => schedule.timestamp);
        
        this.setState(state => ({ 
            preference_name: name,
            propertyValues: propertyValues, 
            schedules: (schedules ? schedules : [])
        }));
    }

    render() {
        return (
            <div className="PreferenceDialog">
                {this.props.preference != undefined &&
                    <div>
                        <div className="PreferenceHeader">
                            <p className="ComponentName"> Preference </p>
                            {this.props.preference.deactivated.isAfter(moment()) && 
                                <div className="ComponentSubtitle">
                                    <p> Scheduling deactivated till </p>
                                    <p> {this.props.preference.deactivated.format("DD/MM/YYYY - HH:mm")} </p>
                                </div>
                            }
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
                                    <div className="Property" key={preferenceProperty.device?.id}>
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
                            {this.props.preference.pendent && 
                                <Button className="Button AcceptButton"
                                    variant="contained" color="default" size="small"
                                    onClick={this._acceptPreference}
                                >
                                    Accept
                                </Button>
                            }
                            {this.props.preference.pendent &&
                                <Button className="Button RejectButton"
                                    variant="contained" color="default" size="small"
                                    onClick={this._rejectPreference}
                                >
                                    Reject
                                </Button>
                            }
                            {!this.props.preference.pendent &&
                                <Button className="Button ApplyButton"
                                    variant="contained" color="default" size="small"
                                    onClick={this._applyPreference}
                                >
                                    Apply Now
                                </Button>
                            }
                            {!this.props.preference.pendent &&
                                <Button className="Button SuspendButton"
                                    variant="contained" color="default" size="small"
                                    onClick={this._deactivatePreference}
                                >
                                    Suspend 24H
                                </Button>
                            }
                            {!this.props.preference.pendent &&
                                <Button className="Button RejectButton"
                                    variant="contained" color="default" size="small"
                                    onClick={this._rejectPreference}
                                >
                                    Delete
                                </Button>
                            }
                        </div>
                    </div>
                }
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
                    this.save_state();
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
            this.save_state();
        }
    }

    _handleTextFieldProperty = async (index: number, e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let value = parseFloat(e.target.value);
            let propertyValues = this.state.propertyValues;

            propertyValues[index].value = value;
            this.setState(state => ({ propertyValues: propertyValues }));

            this.save_state();
        }
    }

    _handleSelectSchedule = (index: number, e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let value = e.target.value;
            let schedules = this.state.schedules;

            schedules[index] = moment(value, "HH:mm");
            this.setState(state => ({ schedules: schedules }));

            this.save_state();
        }
    }

    _acceptPreference = async () => {
        await this.props.preference?.accept();
        this.forceUpdate();
    }

    _rejectPreference = async () => {
        await this.props.preference?.reject();
        this.props.close_function();
    }

    _deactivatePreference = async () => {
        await this.props.preference?.deactivate();
        this.forceUpdate();
    }

    _applyPreference = async () => {
        await this.props.preference?.apply();
        this.forceUpdate();
    }

    // ============================== CHECK EVENTS ==============================

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

    save_state() {
        let data = {
            'name': this.state.preference_name,
            'schedules': this.state.schedules.map(elem => elem.toISOString()),
            'properties': this.state.propertyValues.filter(elem => elem.device != undefined && elem.property != undefined && elem.value != undefined)
                .map(elem => { return { 'device': elem.device, 'property': elem.property, 'value': elem.value }}),
        }

        this.props.preference?.save_state_locally(data);
    }
}

export default PreferenceDialog;