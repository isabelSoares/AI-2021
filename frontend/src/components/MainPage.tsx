import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { ReduxType, mapStateToProps, mapDispatcherToProps } from '@/utils/store/storeEndpoint';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import InfoPanelComponent from "@/components/InfoPanel";
const InfoPanel = () => { return(<InfoPanelComponent/>) }

import '@/general.scss';

// Definition of State
type MainPageState = {
    // Design state
    drawerOpen: boolean,
}

class MainPage extends React.Component<ReduxType, MainPageState> {
    constructor(props: ReduxType) {
        super(props);
        this.state = {
            // Design state
            drawerOpen: false,
        }
    }

    _handleDrawerOpen = () => {
        this.setState(state => ({ drawerOpen: true }));
    };
    
    _handleDrawerClose = () => {
        this.setState(state => ({ drawerOpen: false }));
    };
    
    render() {
        return (
            <div className={"MainPage " + (this.state.drawerOpen ? "drawerOpen" : "drawerClose")}>
                {!this.props.user && <Redirect to={"/"} />}
                
                <AppBar position="fixed" className="AppBar">
                    <Toolbar>
                    {!this.state.drawerOpen && <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this._handleDrawerOpen}
                            edge="start"
                        >
                            <MenuIcon />
                        </IconButton>
                    } 
                    <Typography variant="h6" noWrap>
                        Mini variant drawer
                    </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer className="Drawer"
                    variant="persistent"
                    anchor="left"
                    open={this.state.drawerOpen}
                >
                    <div className="TopPart">
                        <IconButton onClick={this._handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main className="AppContent">
                    <InfoPanel />
                </main>
            </div>
        )
    }

    // ============================== INPUT EVENTS ==============================
    
}

export default connect(mapStateToProps, mapDispatcherToProps) (MainPage);