import React from 'react';

import Button from '@material-ui/core/Button';

import '@/general.scss';

// Definition of State and Props
type SelectionPanelProps = {
    type_name: string,
    elements: any[] | undefined,
    attr_name: string,
    attr_key: string,
    on_click: (id: string) => void,
    selected_id: string | undefined,
}

type SelectionPanelState = {
    
}

class SelectionPanel extends React.Component<SelectionPanelProps, SelectionPanelState> {
    constructor(props: SelectionPanelProps) {
        super(props);
    }

    render() {
        return (
            <div className="SelectionPanel">
                <div className="Title">
                    <p>{this.props.type_name}</p>
                </div>
                <div className="content">
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
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================
    
}

export default SelectionPanel;