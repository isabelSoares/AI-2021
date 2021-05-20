import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import User from 'firebase';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import Router from '@/utils/endpointAPI';

import '@/general.scss';

// Definition of State
type SettingsPanelState = {
    firebase_user: User.User | undefined,
    // Store Add House
    house_id: string | undefined ,
    user_email: string | undefined ,
}

class SettingsPanel extends React.Component<ReduxType, SettingsPanelState> {
    constructor(props: ReduxType) {
        super(props);

        let firebase_user = Router.get_user_logged_in();

        this.state = {
            firebase_user: firebase_user,
            // Store Add House
            house_id: undefined,
            user_email: undefined,
        }
    }
    
    render() {
        return (
            <div>
                <div className="SettingsPanel">
                    <div className="Title">
                        <p> Settings </p>
                    </div>
                    <div className="content">
                        <div className="Info">
                            <Avatar alt="Avatar"> {this.props.user?.name[0]} </Avatar>
                            <div className="MainInfo">
                                <TextField className="ValueInput" onChange={this._handleTextFieldChange} 
                                    required id="name" label="Name" size="small" InputProps={{readOnly: true}}
                                    defaultValue={this.props.user?.name}/>
                                <TextField className="ValueInput" onChange={this._handleTextFieldChange} 
                                    required id="email" label="Email" size="small" InputProps={{readOnly: true}}
                                    defaultValue={this.state.firebase_user?.email}/>
                            </div>
                        </div>
                        <div className="Buttons">
                            {!this.props.user && <Redirect to={"/"} />}
                            <Button className="Button LogoutButton"
                                variant="contained" color="default" size="small"
                                onClick={this._handleClickLogout}>
                                    Logout
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="SettingsPanel">
                    <div className="Title">
                        <p> Add User to House </p>
                    </div>
                    <div className="content">
                        <div className="AddUserToHouse">
                            <div className="AddUserToHouseForm">
                                <TextField className="ValueInput" onChange={this._handleSelectFieldChange} 
                                    required id="house" label="House to Share" size="small" select
                                    defaultValue={this.state.house_id} value={this.state.house_id}>
                                        {this.props.user?.houses?.map((house) => (
                                            <MenuItem id='house' key={house.id} value={house.id}>
                                                {house.name}
                                            </MenuItem>
                                        ))}
                                </TextField>
                                <TextField className="ValueInput" onChange={this._handleTextFieldChange} 
                                    required id="userEmail" label="User Email" size="small"
                                    defaultValue={this.state.user_email} value={this.state.user_email} />
                            </div>
                            <Button className="Button AddUserButton"
                                variant="contained" color="default" size="small"
                                onClick={this._handleClickAddUser} disabled={this._checkAddUserToHouseDisabled()}>
                                    Add User
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    // ============================== CHECK EVENTS ==============================

    _checkAddUserToHouseDisabled = () => {
        let validHouseID = this.state.house_id != undefined;
        let validUserEmail = this.state.user_email != undefined;

        return !validHouseID || !validUserEmail;
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            let id = e.target.id;
            let value = e.target.value;

            switch(id) {
                case 'userEmail':
                    this.setState(state => ({ user_email: value == "" ? undefined : value}));
                    break;
            }
        }
    }

    _handleSelectFieldChange = async (e: React.ChangeEvent<{ value: string }>) => {
        if (e.currentTarget instanceof Element) {
            let targetId = e.currentTarget.id;
            let newValue = e.target.value;

            switch (targetId) {
                case 'house':
                    this.setState(state => ({ house_id: newValue }));
                    break;
            }
        }
    }
    
    _handleClickAddUser = async () => {
        if (this.state.house_id != undefined && this.state.user_email != undefined) {
            await Router.add_house_to_user(this.state.house_id, this.state.user_email);
            this.setState(state => ({ house_id: "", user_email: "" }));
            this.setState(state => ({ house_id: undefined, user_email: undefined }));
        }
    }

    _handleClickLogout = async () => {
        await Router.logout();
        this.props.logoutUser();
    }
}

export default connect(mapStateToProps, mapDispatcherToProps) (SettingsPanel);