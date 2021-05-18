import React from 'react';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

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
                                        <div className="PropertyHeader">
                                            <p className="PropertyName">{propertyValue.property?.name}</p>
                                            {propertyValue.property?.type.type == "Enumerator" && <p className="PropertyType">{propertyValue.property?.type.format()}</p>}
                                            {propertyValue.property?.type.type == "Scalar" && <p className="PropertyType">{propertyValue.property?.type.format()}</p>}
                                        </div>
                                        {propertyValue.property?.type.type == "Enumerator" &&
                                            <div className="PropertyValue Enumerator">
                                                <TextField className="PropertyValueInput" required id="enumeratorValue"
                                                    size="small" name={propertyValue.id} InputProps={{readOnly: true}}
                                                    defaultValue={propertyValue.property?.type.get_values().find(elem => elem.key == propertyValue.value)?.value}/>
                                            </div>
                                        }
                                        {propertyValue.property?.type.type == "Scalar" &&
                                            <div className="PropertyValue Scalar">
                                                <TextField className="PropertyValueInput" required id={propertyValue.id} 
                                                    size="small" InputProps={{readOnly: true}} defaultValue={propertyValue.value}/>
                                                <p className="PropertyUnits">{propertyValue.property?.type.get_units()}</p>
                                            </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        {this.props.preference != undefined && this.props.preference.schedules != undefined && this.props.preference.schedules.length >= 1 && <Divider /> }
                        {this.props.preference.schedules != undefined && this.props.preference.schedules.length >= 1 &&
                            <div className="Schedules">
                                {this.props.preference.schedules?.map((schedule) => {
                                    return (
                                        <TextField className="PreferenceInput TextField Schedule" key={schedule.id}
                                            label="Schedule To" type="datetime-local" defaultValue={schedule.timestamp.format()}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )
                                })}
                            </div>
                        }
                        <Divider />
                        <div className="Buttons">
                            {this.props.preference.pendent && 
                                <Button className="Button AcceptButton"
                                    variant="contained" color="default" size="small"
                                    onClick={() => {}}
                                >
                                    Accept
                                </Button>
                            }
                            {this.props.preference.pendent &&
                                <Button className="Button RejectButton"
                                    variant="contained" color="default" size="small"
                                    onClick={() => {}}
                                >
                                    Reject
                                </Button>
                            }
                            {!this.props.preference.pendent &&
                                <Button className="Button ApplyButton"
                                    variant="contained" color="default" size="small"
                                    onClick={() => {}}
                                >
                                    Apply Now
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

    // ============================== CHECK EVENTS ==============================
}

export default PreferenceDialog;