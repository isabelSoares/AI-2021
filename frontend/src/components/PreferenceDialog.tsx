import React from 'react';
import moment from 'moment';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';

import {Preference} from '@/classes/Preference';

import Router from '@/utils/endpointAPI';

import '@/general.scss';

// Definition of State and Props
type PreferenceDialogProps = {
    preference: Preference | undefined,
    // Functions
    close_function: () => void,
}

type PreferenceDialogState = {
}

class PreferenceDialog extends React.Component<PreferenceDialogProps, PreferenceDialogState> {
    constructor(props: PreferenceDialogProps) {
        super(props);

        this.state = {

        }
    }

    async componentDidMount() {
        await this.props.preference?.full_load();
        this.forceUpdate();
        console.table(this.props.preference);
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
                                required id="name" label="Preference Name" size="medium"
                                defaultValue={this.props.preference.name}/>
                        </div>
                        <Divider />
                        <div className="PreferenceProperties">
                            {this.props.preference.propertyValues && this.props.preference.propertyValues.map((propertyValue, index) => {
                                return (
                                    <div className="Property" key={propertyValue.id}>
                                        <div className="PropertyComponent PropertyDevice">
                                            <TextField className="PropertyInput PropertyValueInput" required id="device"
                                                size="small" name={propertyValue.id} InputProps={{readOnly: true}}
                                                defaultValue={propertyValue.device?.name}/>
                                        </div>
                                        <div className="PropertyComponent PropertyProperty">
                                            <TextField className="PropertyInput PropertyValueInput" required id="property"
                                                size="small" name={propertyValue.id} InputProps={{readOnly: true}}
                                                defaultValue={propertyValue.property?.name}/>
                                        </div>
                                        {propertyValue.property?.type.type == "Enumerator" &&
                                            <div className="PropertyComponent PropertyValue Enumerator">
                                                <TextField className="PropertyInput PropertyValueInput" required id="enumeratorValue"
                                                    size="small" name={propertyValue.id} InputProps={{readOnly: true}}
                                                    defaultValue={propertyValue.property?.type.get_values().find(elem => elem.key == propertyValue.value)?.value}/>
                                            </div>
                                        }
                                        {propertyValue.property?.type.type == "Scalar" &&
                                            <div className="PropertyComponent PropertyValue Scalar">
                                                <TextField className="PropertyInput PropertyValueInput" required id={propertyValue.id} 
                                                    size="small" InputProps={{readOnly: true}} defaultValue={propertyValue.value}/>
                                                <p className="PropertyUnits">{propertyValue.property?.type.get_units()}</p>
                                            </div>
                                        }
                                        <IconButton color="primary" component="span" onClick={() => {}}>
                                            <DeleteIcon className="Icon DeleteIcon"/>
                                        </IconButton>
                                    </div>
                                )
                            })}
                            <div className="ButtonsGroup">
                                <IconButton color="primary" component="span" onClick={() => {}}>
                                    <AddBoxIcon className="Icon AddBoxIcon"/>
                                </IconButton>
                            </div>
                        </div>
                        {this.props.preference != undefined && this.props.preference.schedules != undefined && this.props.preference.schedules.length >= 1 && <Divider /> }
                        {this.props.preference.schedules != undefined && this.props.preference.schedules.length >= 1 &&
                            <div className="Schedules">
                                {this.props.preference.schedules?.map((schedule) => {
                                    return (
                                        <div className="Schedule" key={schedule.id}>
                                            <TextField className="PreferenceInput TextField Schedule" key={schedule.id}
                                                label="Schedule To" type="time" defaultValue={schedule.timestamp.format("HH:mm")}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                            <IconButton color="primary" component="span" onClick={() => {}}>
                                                <DeleteIcon className="Icon DeleteIcon"/>
                                            </IconButton>
                                        </div>
                                    )
                                })}
                                <div className="ButtonsGroup">
                                    <IconButton color="primary" component="span" onClick={() => {}}>
                                        <AddBoxIcon className="Icon AddBoxIcon"/>
                                    </IconButton>
                                </div>
                            </div>
                        }
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

            switch (e.target.id) {
                
            }
        }
    }

    _handleSelectFieldChange = async (e: React.ChangeEvent<{ value: string }>) => {
        if (e.currentTarget instanceof Element) {
            let targetId = e.currentTarget.id;
            let newValue = e.target.value;

            switch (targetId) {
                
            }
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
}

export default PreferenceDialog;