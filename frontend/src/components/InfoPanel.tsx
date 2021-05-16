import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Button from '@material-ui/core/Button';

import SelectionPanel from '@/components/SelectionPanel';

import '@/general.scss';

// Definition of State
type InfoPanelState = {
}

class InfoPanel extends React.Component<ReduxType, InfoPanelState> {
    constructor(props: ReduxType) {
        super(props);
    }

    componentDidMount() {
        this.props.user?.load_houses().finally(() => {
            this.forceUpdate();
        });
    }
    
    render() {
        return (
            <div className="InfoPanel">
                {this.props.user != undefined && 
                    <SelectionPanel type_name="House" elements={this.props.user.houses}
                        attr_name="name" attr_key="id" on_click={this._handleHouseSelection}
                        selected_id={this.props.user.house_id_selected} save_function={this._saveHouse}
                    />
                }
                {this.props.user?.floors != undefined && 
                    <SelectionPanel type_name="Floor" elements={this.props.user.floors}
                        attr_name="name" attr_key="id" on_click={this._handleFloorSelection}
                        selected_id={this.props.user.floor_id_selected} save_function={this._saveFloor}
                    />
                }
                {this.props.user?.divisions != undefined && 
                    <SelectionPanel type_name="Division" elements={this.props.user.divisions}
                        attr_name="name" attr_key="id" on_click={this._handleDivisionSelection}
                        selected_id={this.props.user.division_id_selected} save_function={this._saveDivision}
                    />
                }
            </div>
        )
    }

    // ============================== SAVE EVENTS ==============================

    _saveHouse = async (new_house_data: {'name': string}) => {
        await this.props.user?.add_new_house(new_house_data);
        this.forceUpdate();
    }

    _saveFloor = async (new_floor_data: {'name': string}) => {
        await this.props.user?.add_new_floor(new_floor_data);
        this.forceUpdate();
    }
    
    _saveDivision = async (new_division_data: {'name': string}) => {
        await this.props.user?.add_new_division(new_division_data);
        this.forceUpdate();
    }

    // ============================== INPUT EVENTS ==============================

    _handleHouseSelection = async (id: string) => {
        if (this.props.user == undefined) return;

        // If didn't change
        if (this.props.user.house_id_selected == id) return
        this.props.user.select_house(id);
        this.props.user.load_floors().finally(() => {
            this.forceUpdate();
        });
    }

    _handleFloorSelection = async (id: string) => {
        if (this.props.user == undefined) return;

        // If didn't change
        if (this.props.user.floor_id_selected == id) return
        this.props.user.select_floor(id);
        this.props.user.load_divisions().finally(() => {
            this.forceUpdate();
        });
    }
    
    _handleDivisionSelection = async (id: string) => {
        if (this.props.user == undefined) return;

        // If didn't change
        if (this.props.user.division_id_selected == id) return
        this.props.user.select_division(id);
        this.props.user.load_devices().finally(() => {
            this.forceUpdate();
        });
    }
    
}

export default connect(mapStateToProps, mapDispatcherToProps) (InfoPanel);