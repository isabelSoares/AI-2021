import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';

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

class FavoritesPanel extends React.Component<ReduxType, DevicesPanelState> {
    constructor(props: ReduxType) {
        super(props);

        this.state = {
            selectedDevice: undefined,
            // Design state
            modalOpen: false,
        }
    }

    componentDidMount() {
        this.props.user?.load_favorites().finally(() => {
            this.forceUpdate();
        });
    }
    
    render() {
        return (
            <div className="FavoritesPanel">
                {this.props.user?.favorites &&
                    <div className="SelectionPanel">
                        <div className="Title">
                            <p> Favorite Devices </p>
                        </div>
                        <div className="content">
                            <div className="options">
                                {this.props.user.favorites.map((device, index) => {
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
        if (this.props.user == undefined || this.props.user.favorites == undefined) return;

        let selectedDevice = this.props.user.favorites.find((element) => element.id == id);

        this.setState(state => ({
            selectedDevice: selectedDevice,
            modalOpen: true,
        }));
    }

    _handleModalClose = () => {
        this.setState(state => ({ modalOpen: false }));
        if (this.props.user != undefined && this.props.user.favorites != undefined) {
            this.props.user.favorites = this.props.user.favorites.filter((device) => device.favorite);
        }
    }
}

export default connect(mapStateToProps, mapDispatcherToProps) (FavoritesPanel);