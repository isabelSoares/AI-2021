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

import ApartmentIcon from '@material-ui/icons/Apartment';
import DevicesIcon from '@material-ui/icons/Devices';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

import InfoPanelComponent from "@/components/InfoPanel";
const InfoPanel = () => { return(<InfoPanelComponent/>) }

import '@/general.scss';

// Definition of State
type MainPageState = {
    selectedOption: { 'key': string, 'title': string },
    // Design state
    drawerOpen: boolean,
}

class MainPage extends React.Component<ReduxType, MainPageState> {
    constructor(props: ReduxType) {
        super(props);
        this.state = {
            selectedOption: { 'key': 'DivisionSelection', 'title': 'Division Selection'},
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

    handleClickedOption(option: { key: string, title: string }) {
        if (this.state.selectedOption.key == option.key) return;
        this.setState(state => ({ selectedOption: option }));
    }
    
    render() {

        let drawerOptions = {
            'top': [
                { 'key': 'DivisionSelection', 'icon': <ApartmentIcon/>, 'text': 'Division Selection' },
                { 'key': 'Devices', 'icon': <DevicesIcon/>, 'text': 'Devices' },
            ],

            'bottom': [
                { 'key': 'ScheduledEvents', 'icon': <DateRangeIcon/>, 'text': 'Scheduled Events' },
                { 'key': 'Favorites', 'icon': <FavoriteIcon/>, 'text': 'Favorites' },
                { 'key': 'Settings', 'icon': <SettingsIcon/>, 'text': 'Settings' },
            ],
        }

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
                            Home Smart Home: { this.state.selectedOption.title }
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
                    <div className="Options">
                        {[drawerOptions.top, drawerOptions.bottom].map((options, index) => (
                            <div key={index}>
                                <List>
                                    {options.map((item, index) => (
                                        <ListItem
                                            key={item.key}
                                            button={(this.state.selectedOption.key != item.key) as any}
                                            className={this.state.selectedOption.key == item.key ? "OptionSelected" : ""}
                                            onClick={() => this.handleClickedOption({ 'key': item.key, 'title': item.text })}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        ))}
                    </div>
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