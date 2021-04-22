import React, {Component} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

import {User, load_user} from '@/classes/User';

export class AskUser extends Component {
    userID : string | undefined = undefined;
    user : User | undefined = undefined;
    
    render() {
        return (
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
        )
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        this.userID = e.target.value == "" ? undefined : e.target.value;
    }

    _handleSendUser = async () => {
        if (this.userID != undefined) {
            try {
                this.user = await getInformation(this.userID);
                console.log(this.user);
            } catch (error) {
                console.log(error);
            }
        }
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
