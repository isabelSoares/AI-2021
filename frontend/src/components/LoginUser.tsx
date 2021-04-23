import React, {Component} from 'react';
import { Redirect } from "react-router-dom";

import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import {User, load_user} from '@/classes/User';

// Definition of Props and State
type LoginUserProps = {}
type LoginUserState = {
    // General attributes
    error: string | undefined,
    // Specific attributes
    userID: string | undefined,
    user: User | undefined,
}

export class LoginUser extends Component<LoginUserProps, LoginUserState> {
    constructor(props: LoginUserProps) {
        super(props);
        this.state = {
            // General attributes
            error: undefined,
            // Specific attributes
            userID: undefined,
            user: undefined,
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
                {this.state.user && <Redirect to={"/info-panel"} />}
                <form noValidate autoComplete="off">
                    <TextField onChange={this._handleTextFieldChange} id="standard-basic" label="User ID" />
                    <Button
                        variant="contained"
                        color="default"
                        size="small"
                        endIcon={<SendIcon />}
                        onClick={this._handleSendUser}
                        >
                        Send
                    </Button>
                </form>
            </div>
        );
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        this.setState(state => ({ userID: e.target.value == "" ? undefined : e.target.value}));
    }

    _handleSendUser = async () => {
        if (this.state.userID != undefined) {
            getInformation(this.state.userID).then(user => {
                this.setState(state => ({ user: user }))
                console.log(this.state.user);
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
    } else return load_user(response.data)
}
