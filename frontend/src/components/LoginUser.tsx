import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import {User, load_user} from '@/classes/User';

import '@/general.scss';

// Definition of State
type LoginUserState = {
    // General attributes
    error: string | undefined,
    // Specific attributes
    userID: string | undefined,
    userPassword: string | undefined,
}

class LoginUser extends React.Component<ReduxType, LoginUserState> {
    constructor(props: ReduxType) {
        super(props);
        this.state = {
            // General attributes
            error: undefined,
            // Specific attributes
            userID: undefined,
            userPassword: undefined,
        }
    }
    
    render() {
        return (
            <div>
                {this.state.error && <Alert
                    severity="error"
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {this._closeAlert()}}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    >
                    TestError
                </Alert>}
                {this.props.user && <Redirect to={"/info-panel"} />}
                <form className='center' noValidate autoComplete="off">
                    <TextField className="TextField" onChange={this._handleTextFieldChange} required id="userId" label="User ID" />
                    <TextField className="TextField" onChange={this._handleTextFieldChange} id="password" label="Password" type="password"/>
                    <Button className="Button LoginButton"
                        disabled={!this.state.userID}
                        variant="contained"
                        color="default"
                        size="small"
                        onClick={this._handleSendUser}
                        >
                        Login
                    </Button>
                </form>
            </div>
        );
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            switch(e.target.id) {
                case 'userId':
                    this.setState(state => ({ userID: e.target.value == "" ? undefined : e.target.value}));
                    break;
                case 'password':
                    this.setState(state => ({ userPassword: e.target.value == "" ? undefined : e.target.value}));
                    break;
            }
        }
    }

    _handleSendUser = async () => {
        if (this.state.userID != undefined) {
            getInformation(this.state.userID).then(user => {
                this.props.saveUser(user);
            }).catch(error => {
                this._openAlert(error);
            });
        }
    }

    // ============================== HANDLE EVENTS ==============================
    _openAlert(error_message: string) {
        this.setState(state => ({ error: error_message }));
    }

    _closeAlert() {
        this.setState(state => ({ error: undefined }));
    }
    
}

async function getInformation(userID : string) : Promise<User> {
    let address : string = "http://localhost:8000/user/" + userID;
    const response = await axios.get(address);

    if (typeof response.data === "string") {
        console.log("ERROR");
        throw new Error();
    } else return load_user(userID, response.data)
}

export default connect(mapStateToProps, mapDispatcherToProps) (LoginUser);