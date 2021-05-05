import React from 'react';
import { connect } from 'react-redux';
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Button from '@material-ui/core/Button';

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
                <div className="SelectionPanel">
                    <div className="Title">
                        <p>House</p>
                    </div>
                    <div className="content">
                        <p className="Instruction"> Select a valid house:</p>
                        {this.props.user?.houses &&
                            <div className="options">
                                {this.props.user.houses.map((house, index) => {
                                    return <Button className="SelectionButton" key={house.id}
                                        variant="contained"
                                        >
                                            {house.name}
                                        </Button>
                                })}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================
    
}

export default connect(mapStateToProps, mapDispatcherToProps) (InfoPanel);