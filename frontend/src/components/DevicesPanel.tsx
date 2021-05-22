import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';

import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import AddBoxIcon from '@material-ui/icons/AddBox';

import DeviceDialog from '@/components/DeviceDialog';
import AddDeviceDialog from '@/components/AddDeviceDialog';

import { Device } from '@/classes/Device';

import '@/general.scss';

// Definition of State
type DevicesPanelState = {
    selectedDevice: Device | undefined,
    // Design state
    modalDeviceOpen: boolean,
    modalAddDeviceOpen: boolean,
}

class DevicesPanel extends React.Component<ReduxType, DevicesPanelState> {
    constructor(props: ReduxType) {
        super(props);

        this.state = {
            selectedDevice: undefined,
            // Design state
            modalDeviceOpen: false,
            modalAddDeviceOpen: false,
        }
    }

    componentDidMount() {
        this.props.user?.load_devices().finally(() => {
            this.forceUpdate();
        });
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
                            <div className="main-content">
                                <div className="options">
                                    {this.props.user.devices.map((device, index) => {
                                        return (
                                            <Box className="OptionDevice" key={device.id} onClick={() => this._handleClickDevice(device.id)}>
                                                <div className="OptionDeviceHeader">
                                                    <p className="DeviceName"> {device.name} </p>
                                                    <p className="DeviceType">
                                                        {device.deviceType != undefined ? device.deviceType.name : "Unknown"}
                                                    </p>
                                                </div>
                                                {device.favorite && <Favorite className="FavoriteIcon"/>}
                                                {!device.favorite && <FavoriteBorder className="NonFavoriteIcon"/>}
                                            </Box>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="Buttons"> 
                                <IconButton color="primary" component="span" onClick={() => this._handleClickAddDevice()}>
                                    <AddBoxIcon className="AddBoxIcon"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                }

                <Dialog
                    open={this.state.modalDeviceOpen}
                    onClose={this._handleModalDeviceClose}
                >
                    <DeviceDialog user_id={this.props.user?.id} device={this.state.selectedDevice} close_function={this._handleModalDeviceClose} />
                </Dialog>
                <Dialog
                    open={this.state.modalAddDeviceOpen}
                    onClose={this._handleModalAddDeviceClose}
                >
                    <AddDeviceDialog close_function={this._handleModalAddDeviceClose} save_function={this._saveDevice} />
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
            modalDeviceOpen: true,
        }));
    }
    
    _handleModalDeviceClose = () => {
        this.setState(state => ({ modalDeviceOpen: false }));
    }
    
    _handleClickAddDevice = () => {
        this.setState(state => ({
            modalAddDeviceOpen: true,
        }));
    }
    
    _handleModalAddDeviceClose = () => {
        this.setState(state => ({ modalAddDeviceOpen: false }));
    }
    
    // ============================== SAVE EVENTS ==============================

    _saveDevice = async (new_device_data: {'name': string, 'favorite': boolean, 'deviceType_id': string, 'propertyValues': {'property_id': string, 'value': number }[]}) => {
        await this.props.user?.add_new_device(new_device_data);
        this.forceUpdate();
    }
}

export default connect(mapStateToProps, mapDispatcherToProps) (DevicesPanel);