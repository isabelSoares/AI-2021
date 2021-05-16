import React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';

import AddBoxIcon from '@material-ui/icons/AddBox';

import AddComponentDialog from '@/components/AddComponentDialog';

import '@/general.scss';

// Definition of State and Props
type SelectionPanelProps = {
    type_name: string,
    elements: any[] | undefined,
    attr_name: string,
    attr_key: string,
    selected_id: string | undefined,
    on_click: (id: string) => void,
    save_function: (data: {'name': string}) => Promise<void>,
}

type SelectionPanelState = {
    // Design state
    modalOpen: boolean,
}

class SelectionPanel extends React.Component<SelectionPanelProps, SelectionPanelState> {
    constructor(props: SelectionPanelProps) {
        super(props);

        this.state = {
            // Design state
            modalOpen: false,
        }
    }

    render() {
        return (
            <div className="SelectionPanel">
                <div className="Title">
                    <p>{this.props.type_name}</p>
                </div>
                <div className="content">
                    <div className="main-content">
                        <p className="Instruction"> Select a valid {this.props.type_name.toLowerCase()}:</p>
                        {this.props.elements &&
                            <div className="options">
                                {this.props.elements.map((element, index) => {
                                    return <Button className={"SelectionButton " + (this.props.selected_id == element[this.props.attr_key] ? "OptionSelected" : "")}
                                        key={element[this.props.attr_key]} disabled={this.props.selected_id == element[this.props.attr_key]}
                                        onClick={() => this.props.on_click(element[this.props.attr_key])}
                                        variant="contained" 
                                        >
                                            {element[this.props.attr_name]}
                                    </Button>
                                })}
                            </div>
                        }
                    </div>
                    <div className="Buttons"> 
                        <IconButton color="primary" component="span" onClick={() => this._handleClickAdd()}>
                            <AddBoxIcon className="AddBoxIcon"/>
                        </IconButton>
                    </div>
                </div>

                <Dialog
                    open={this.state.modalOpen}
                    onClose={this._handleModalClose}
                >
                    <AddComponentDialog component_type={this.props.type_name} 
                        previous_id="" close_function={this._handleModalClose} save_function={this.props.save_function} />
                </Dialog>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================
    
    _handleClickAdd = () => {
        this.setState(state => ({
            modalOpen: true,
        }));
    }

    _handleModalClose = () => {
        this.setState(state => ({ modalOpen: false }));
    }
}

export default SelectionPanel;