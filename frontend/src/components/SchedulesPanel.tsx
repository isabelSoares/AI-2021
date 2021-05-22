import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { Preference } from '@/classes/Preference';

import PreferenceDialog from '@/components/PreferenceDialog';

import '@/general.scss';

// Definition of State
type SchedulesPanelState = {
    selectedPreference: Preference | undefined,
    // Design state
    modalOpen: boolean,
}

class SchedulesPanel extends React.Component<ReduxType, SchedulesPanelState> {
    constructor(props: ReduxType) {
        super(props);

        this.state = {
            selectedPreference: undefined,
            // Design state
            modalOpen: false,
        }
    }

    componentDidMount() {
        this.props.user?.load_preferences().finally(() => {
            this.forceUpdate();
            console.table(this.props.user?.preferences);
        });
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
                    </div>
                </div>
                <Dialog
                    open={this.state.modalOpen}
                    onClose={this._handleModalClose}
                >
                    <PreferenceDialog preference={this.state.selectedPreference} close_function={this._handleModalClose} />
                </Dialog>
            </div>
        )
    }
    
    // ============================== CHECK EVENTS ==============================

    _handleModalClose = () => {
        this.setState(state => ({ modalOpen: false }));
    }

    // ============================== INPUT EVENTS ==============================

    _handleClickPreference = (id: string) => {
        if (this.props.user == undefined || this.props.user.preferences == undefined) return;
        
        let selectedPreference = this.props.user.preferences.find((element) => element.id == id);
        
        this.setState(state => ({
            selectedPreference: selectedPreference,
            modalOpen: true,
        }));
    }

}

export default connect(mapStateToProps, mapDispatcherToProps) (SchedulesPanel);