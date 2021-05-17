import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

import clone from 'clone';
import underscore from 'underscore';

import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {Device} from '@/classes/Device';

import '@/general.scss';

const graphLines = [
    {'weekday': 'Sunday', 'color': "#eb4034"},
    {'weekday': 'Monday', 'color': "#eb9c34"},
    {'weekday': 'Tuesday', 'color': "#09e31f"},
    {'weekday': 'Wednesday', 'color': "#5871ed"},
    {'weekday': 'Thursday', 'color': "#091547"},
    {'weekday': 'Friday', 'color': "#6e15b3"},
    {'weekday': 'Saturday', 'color': "#b31544"},
]

// Definition of State and Props
type DeviceDialogProps = {
    device: Device | undefined,
    close_function: () => void,
}

type DeviceDialogState = {
    copy_device: Device | undefined,
    data: any | undefined,
    invalid_inputs: string[],
    // Design state
    expandedAccordion: string | undefined,
}

class DeviceDialog extends React.Component<DeviceDialogProps, DeviceDialogState> {
    constructor(props: DeviceDialogProps) {
        super(props);

        this.state = {
            copy_device: clone(this.props.device),
            data: undefined,
            invalid_inputs: [],
            // Design state
            expandedAccordion: 'properties'
        }
    }

    componentDidMount() {
        this.props.device?.full_load().finally(() => {
            this.setState(state => ({
                copy_device: clone(this.props.device),
                data: this.props.device?.get_graph_data(),
            }));

            this.forceUpdate();
        });
    }

    render() {
        return (
            <div className="DeviceDialog">
                {this.props.device != undefined &&
                    <div>
                        <div className="DeviceHeader">
                            <div className="DeviceMainInfo">
                                <p className="DeviceName"> {this.props.device.name} </p>
                                <p className="DeviceType"> {this.props.device.name} </p>
                            </div>
                            <IconButton color="primary" component="span" onClick={() => this._handleChangeFavoriteState()}>
                                {this.props.device.favorite && <Favorite className="FavoriteIcon"/>}
                                {!this.props.device.favorite && <FavoriteBorder className="NonFavoriteIcon"/>}
                            </IconButton>
                        </div>
                        <Divider />
                        <Accordion expanded={this.state.expandedAccordion === 'properties'} onChange={() => this._handleAccordionChange('properties')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <p className="AccordionTitle">Properties</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                {this.props.device.propertyValues && this.props.device.propertyValues.map((propertyValue, index) => {
                                    return (
                                        <div key={propertyValue.id}>
                                            <div className="Property">
                                                <div className="PropertyHeader">
                                                    <p className="PropertyName">{propertyValue.property?.name}</p>
                                                    {propertyValue.property?.type.type == "Enumerator" && <p className="PropertyType">{propertyValue.property?.type.format()}</p>}
                                                    {propertyValue.property?.type.type == "Scalar" && <p className="PropertyType">{propertyValue.property?.type.format()}</p>}
                                                </div>
                                                {propertyValue.property?.type.type == "Enumerator" &&
                                                    <div className="PropertyValue Enumerator">
                                                        <TextField className="PropertyValueInput" onChange={this._handleSelectFieldChange}
                                                            required id="enumeratorValue"label="Value"size="small" name={propertyValue.id}
                                                            value={propertyValue.value} disabled={!propertyValue.property.writable} select
                                                        >
                                                            {propertyValue.property?.type.get_values().map((value) => (
                                                                <MenuItem id={propertyValue.id} key={value.key} value={value.key}>
                                                                    {value.value}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>
                                                }
                                                {propertyValue.property?.type.type == "Scalar" &&
                                                    <div className="PropertyValue Scalar">
                                                        <TextField className="PropertyValueInput" onChange={this._handleTextFieldChange} 
                                                            required id={propertyValue.id} label="Value" size="small" disabled={!propertyValue.property.writable}
                                                            error={this.state.invalid_inputs.includes(propertyValue.id)}
                                                            defaultValue={propertyValue.value}/>
                                                        <p className="PropertyUnits">{propertyValue.property?.type.get_units()}</p>
                                                    </div>
                                                }
                                            </div>
                                            <Divider />
                                        </div>
                                    )
                                })}
                                <div className="Buttons">
                                    <Button className="Button SaveButton"
                                        variant="contained" color="default" size="small"
                                        disabled={underscore.isEqual(this.props.device.propertyValues, this.state.copy_device?.propertyValues) || this.state.invalid_inputs.length != 0}
                                        onClick={() => this._handleSaveChanges()}
                                        >
                                        Save
                                    </Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={this.state.expandedAccordion === 'graph'} onChange={() => this._handleAccordionChange('graph')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <p className="AccordionTitle">Graphs</p>
                            </AccordionSummary>
                            <AccordionDetails>
                                { this.state.data != undefined &&
                                    <ResponsiveContainer>
                                        <LineChart data={this.state.data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="key" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            { graphLines.map((line) => {
                                                return (
                                                    <Line key={line['weekday']} type="monotone" dataKey={line['weekday']} stroke={line['color']} />
                                                )
                                            })}
                                        </LineChart>
                                    </ResponsiveContainer>
                                }
                            </AccordionDetails>
                        </Accordion>
                    </div>
                }
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================
    
    _handleAccordionChange = (code: string) => {
        if (this.state.expandedAccordion == code) this.setState(state => ({ expandedAccordion: undefined }));
        else this.setState(state => ({ expandedAccordion: code }));
    }

    _handleChangeFavoriteState = async () => {
        this.props.device?.change_favorite_state().then(() => this.forceUpdate());
    }

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let id = e.target.id;
            let value = parseFloat(e.target.value);

            let valid;
            if (value == NaN) valid = false; 
            else valid = this.props.device?.change_property_value(id, parseFloat(e.target.value));

            if (valid && this.state.invalid_inputs.includes(id)) {
                let new_invalid_inputs = this.state.invalid_inputs.filter((elem) => elem != id);
                this.setState(state => ({ invalid_inputs: new_invalid_inputs }));
            } else if (!valid && ! this.state.invalid_inputs.includes(id)) {
                this.setState(state => ({ invalid_inputs: state.invalid_inputs.concat([id]) }))
            }

            this.forceUpdate();
        }
    }

    _handleSelectFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.currentTarget instanceof Element) {
            this.props.device?.change_property_value(e.currentTarget.id, parseFloat(e.target.value));
            this.forceUpdate();
        }
    }

    _handleSaveChanges = async () => {
        if (this.state.copy_device == undefined) return;

        await this.props.device?.save_new_properties(this.state?.copy_device);
        this.setState(state => ({ copy_device: clone(this.props.device) }));
        this.forceUpdate();
    }
}

export default DeviceDialog;