import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import DeviceDialog from '@/components/DeviceDialog';

import { Device } from '@/classes/Device';

import '@/general.scss';

// Definition of State
type DevicesPanelState = {
    selectedDevice: Device | undefined,
    // Design state
    modalOpen: boolean,
}

class DevicesPanel extends React.Component<ReduxType, DevicesPanelState> {
    constructor(props: ReduxType) {
        super(props);

        this.state = {
            selectedDevice: undefined,
            // Design state
            modalOpen: false,
        }
    }
    
    render() {
        return (
            <div className="DevicesPanel">
                {this.props.user?.devices &&
                    <div className="SelectionPanel">
                        <div className="Title">
                            <p> {this.props.user.house_selected?.name + " → "
                                + this.props.user.floor_selected?.name + " → "
                                + this.props.user.division_selected?.name}
                            </p>
                        </div>
                        <div className="content">
                            <div className="options">
                                {this.props.user.devices.map((device, index) => {
                                    return (
                                        <Box className="OptionDevice" key={device.id} onClick={() => this._handleClickDevice(device.id)}>
                                            <div className="OptionDeviceHeader">
                                                <p className="DeviceName"> {device.name} </p>
                                                {device.favorite && <Favorite className="FavoriteIcon"/>}
                                                {!device.favorite && <FavoriteBorder className="NonFavoriteIcon"/>}
                                            </div>
                                            <Divider />
                                            <p className="DeviceType">
                                                {device.deviceType != undefined ? device.deviceType.name : "Unknown"}
                                            </p>
                                        </Box>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }

                <Dialog
                    open={this.state.modalOpen}
                    onClose={this._handleModalClose}
                >
                    <DeviceDialog device={this.state.selectedDevice} close_function={this._handleModalClose} />
                </Dialog>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================

    _handleClickDevice = (id: string) => {
        if (this.props.user == undefined || this.props.user.devices == undefined) return;

        let selectedDevice = this.props.user.devices.find((element) => element.id == id);

        this.setState(state => ({
            selectedDevice: selectedDevice,
            modalOpen: true,
        }));
    }

    _handleModalClose = () => {
        this.setState(state => ({ modalOpen: false }));
    }
}

export default connect(mapStateToProps, mapDispatcherToProps) (DevicesPanel);