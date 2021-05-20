import React from 'react';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import '@/general.scss';

// Definition of State and Props
type AddComponentDialogProps = {
    component_type: string,
    previous_id: string,
    close_function: () => void,
    save_function: (data: {'name': string}) => Promise<void>,
}

type AddComponentDialogState = {
    name: string | undefined,
}

class AddComponentDialog extends React.Component<AddComponentDialogProps, AddComponentDialogState> {
    constructor(props: AddComponentDialogProps) {
        super(props);

        this.state = {
            name: undefined,
        }
    }

    render() {
        return (
            <div className="AddComponentDialog">
                <div className="AddComponentHeader">
                    <p className="ComponentName"> New {this.props.component_type} </p>
                </div>
                <div className="AddComponentContent">
                        <TextField className="AddComponentParameter" onChange={this._handleTextFieldChange} 
                            required id="name" label={this.props.component_type + " Name"} size="medium"
                            defaultValue=""/>
                </div>
                <div className="Buttons">
                    <Button className="Button SaveButton"
                        variant="contained" color="default" size="small"
                        disabled={this.state.name == undefined}
                        onClick={() => this._handleSaveChanges()}
                        >
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================

    _handleTextFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (e.target instanceof Element) {
            switch(e.target.id) {
                case 'name':
                    this.setState(state => ({ name: e.target.value == "" ? undefined : e.target.value}));
                    break;
            }
        }
    }

    _handleSaveChanges = async () => {
        if (this.state.name == undefined) return;

        await this.props.save_function({'name': this.state.name });
        this.props.close_function();
    }
}

export default AddComponentDialog;