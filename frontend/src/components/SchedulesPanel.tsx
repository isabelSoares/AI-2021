import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';

import AddBoxIcon from '@material-ui/icons/AddBox';

import PreferenceDialog from '@/components/PreferenceDialog';
import AddPreferenceDialog from '@/components/AddPreferenceDialog';

import { Preference } from '@/classes/Preference';
import { Device } from '@/classes/Device';

import Router from '@/utils/endpointAPI';

import '@/general.scss';

// Definition of State
type SchedulesPanelState = {
    allDevices: Device[],
    selectedPreference: Preference | undefined,
    // Design state
    modalPreferenceOpen: boolean,
    modalNewPreferenceOpen: boolean,
}

class SchedulesPanel extends React.Component<ReduxType, SchedulesPanelState> {
    constructor(props: ReduxType) {
        super(props);

        this.state = {
            allDevices: [],
            selectedPreference: undefined,
            // Design state
            modalPreferenceOpen: false,
            modalNewPreferenceOpen: false,
        }
    }

    async componentDidMount() {
        this.props.user?.load_preferences().finally(() => {
            this.forceUpdate();
        });

        if (this.props.user != undefined) {
            let devices = await Router.load_devices(this.props.user.id);
            this.setState(state => ({ allDevices: devices }));
        }
    }
    
    render() {
        return (
            <div className="SchedulesPanel">
                <div className="SelectionPanel">
                    <div className="Title">
                        <p> Pendent Schedules </p>
                    </div>
                    <div className="content">
                        <div className="main-content">
                            {this.props.user && this.props.user.preferences &&
                                <div className="options">
                                    {this.props.user.preferences.filter((element) => element.pendent && !element.deleted).map((element) => {
                                        return <Button className="SelectionButton" key={element.id} variant="contained" 
                                            onClick={() => this._handleClickPreference(element.id)}
                                            >
                                                {element.name}
                                        </Button>
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="SelectionPanel">
                    <div className="Title">
                        <p> Current Preferences and Schedules </p>
                    </div>
                    <div className="content">
                        <div className="main-content">
                            {this.props.user && this.props.user.preferences &&
                                <div className="options">
                                    {this.props.user.preferences.filter((element) => !element.pendent && !element.deleted).map((element) => {
                                        return <Button className="SelectionButton" key={element.id} variant="contained" 
                                            onClick={() => this._handleClickPreference(element.id)}
                                            >
                                                {element.name}
                                        </Button>
                                    })}
                                </div>
                            }
                        </div>
                        <div className="Buttons"> 
                            <IconButton color="primary" component="span" onClick={this._handleClickNewPreference}>
                                <AddBoxIcon className="AddBoxIcon"/>
                            </IconButton>
                        </div>
                    </div>
                </div>
                <Dialog
                    open={this.state.modalPreferenceOpen}
                    onClose={this._handlePreferenceModalClose}
                >
                    <PreferenceDialog devices={this.state.allDevices} preference={this.state.selectedPreference} close_function={this._handlePreferenceModalClose} />
                </Dialog>
                <Dialog
                    open={this.state.modalNewPreferenceOpen}
                    onClose={this._handleNewPreferenceModalClose}
                >
                    <AddPreferenceDialog devices={this.state.allDevices} save_function={this._handleSaveNewPreference} close_function={this._handleNewPreferenceModalClose} />
                </Dialog>
            </div>
        )
    }
    
    // ============================== CHECK EVENTS ==============================

    _handlePreferenceModalClose = () => {
        if (this.state.selectedPreference == undefined) return;

        this.props.user?.update_preference(this.state.selectedPreference.id);
        this.setState(state => ({ modalPreferenceOpen: false }));
    }

    _handleNewPreferenceModalClose = () => {
        this.setState(state => ({ modalNewPreferenceOpen: false }));
    }

    _handleSaveNewPreference = async (data: {'name': string, 'properties': {'device': string, 'property': string, 'value': number}[], 'schedules': {'timestamp': string}[] }) => {
        await this.props.user?.create_preference(data);
    }

    // ============================== INPUT EVENTS ==============================

    _handleClickPreference = (id: string) => {
        if (this.props.user == undefined || this.props.user.preferences == undefined) return;
        
        let selectedPreference = this.props.user.preferences.find((element) => element.id == id);
        selectedPreference?.clear_save_state();
        
        this.setState(state => ({
            selectedPreference: selectedPreference,
            modalPreferenceOpen: true,
        }));
    }

    _handleClickNewPreference = () => {
        this.setState(state => ({ modalNewPreferenceOpen: true }));
    }

}

export default connect(mapStateToProps, mapDispatcherToProps) (SchedulesPanel);