import React, {Component} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

export class AskUser extends Component {
    user : string | undefined = undefined;
    
    render() {
        return (
            <form noValidate autoComplete="off">
                <TextField value={this.user} id="standard-basic" label="User ID" />
                <Button
                    variant="contained"
                    color="default"
                    size="small"
                    endIcon={<SendIcon />}
                    onClick={this.handleSendUser}
                    >
                    Send
                </Button>
            </form>
        )
    }

    handleSendUser = () => {
        console.log(this.user);
        if (this.user != undefined) {
            console.log("Oi");
            getInformation(this.user);
        }
    }
}

function getInformation(userID : string) {
    console.log(userID)
    /*
    const response = await axios.get(gitHubUrl);
    console.log(response);*/
}