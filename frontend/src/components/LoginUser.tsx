import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import Router from '@/utils/endpointAPI';

import '@/general.scss';

// Definition of State
type LoginUserState = {
    newUser: boolean,
    // Specific attributes
    name: string | undefined,
    userEmail: string | undefined,
    userPassword: string | undefined,
}

class LoginUser extends React.Component<ReduxType, LoginUserState> {
    constructor(props: ReduxType) {
        super(props);

        this.state = {
            newUser: false,
            // Specific attributes
            name: undefined,
            userEmail: undefined,
            userPassword: undefined,
        }
    }
    
    render() {
        return (
            <div>
                {this.props.user && <Redirect to={"/main-page"} />}
                <form className='center' noValidate autoComplete="off">
                    { this.state.newUser && <TextField className="TextField" onChange={this._handleTextFieldChange} required id="name" label="Name" /> }
                    <TextField className="TextField" onChange={this._handleTextFieldChange} required id="userEmail" label="Email" />
                    <TextField className="TextField" onChange={this._handleTextFieldChange} id="password" label="Password" type="password"/>
                    <Button className="Button LoginButton"
                        disabled={this._handleButtonDisabled()}
                        variant="contained"
                        color="default"
                        size="small"
                        onClick={this._handleSendUser}
                        >
                        {this.state.newUser ? "Sign In" : "Login"}
                    </Button>
                    <Link className="Link" component="button"
                        variant="body2" onClick={this._handleChangeType} >
                            {this.state.newUser ? "Login" : "Sign In"}
                    </Link>
                </form>
            </div>
        );
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            switch(e.target.id) {
                case 'name':
                    this.setState(state => ({ name: e.target.value == "" ? undefined : e.target.value}));
                    break;
                case 'userEmail':
                    this.setState(state => ({ userEmail: e.target.value == "" ? undefined : e.target.value}));
                    break;
                case 'password':
                    this.setState(state => ({ userPassword: e.target.value == "" ? undefined : e.target.value}));
                    break;
            }
        }
    }

    _handleSendUser = async () => {

        if (this.state.newUser) {
            if (this.state.name != undefined && this.state.userEmail != undefined && this.state.userPassword != undefined) {
                let user = await Router.create_new_user(this.state.name, this.state.userEmail, this.state.userPassword);
                if (user == undefined) return;
                this.props.saveUser(user);
            }

        } else {
            if (this.state.userEmail != undefined && this.state.userPassword != undefined) {
                let user = await Router.load_user(this.state.userEmail, this.state.userPassword);
                if (user == undefined) return;
                this.props.saveUser(user);
            }
        }
    }

    _handleChangeType = () => {
        this.setState(state => ({ newUser: !state.newUser }))
    }

    _handleButtonDisabled = () => {
        if (this.state.newUser) return !this.state.name || !this.state.userEmail || !this.state.userPassword;
        else return !this.state.userEmail || !this.state.userPassword;
    }

    // ============================== HANDLE EVENTS ==============================

}

export default connect(mapStateToProps, mapDispatcherToProps) (LoginUser);