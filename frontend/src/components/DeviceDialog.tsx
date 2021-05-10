import React from 'react';

import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {Device} from '@/classes/Device';

import '@/general.scss';

// Definition of State and Props
type DeviceDialogProps = {
    device: Device | undefined,
    close_function: () => void,
}

type DeviceDialogState = {
    // Design state
    expandedAccordion: string | undefined,
}

class DeviceDialog extends React.Component<DeviceDialogProps, DeviceDialogState> {
    constructor(props: DeviceDialogProps) {
        super(props);

        this.state = {
            expandedAccordion: 'properties'
        }
    }

    componentDidMount() {
        this.props.device?.full_load().finally(() => {
            this.forceUpdate();
            console.log("Properties: ", this.props.device?.deviceType?.properties);
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
                            <IconButton color="primary" component="span">
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
                                <p>Properties will be here</p>
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
                                <p>Graphs will be here</p>
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
}

export default DeviceDialog;