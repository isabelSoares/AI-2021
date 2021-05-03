import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// ==================== Component ==================== 
import LoginUserComponent from "@/components/LoginUser";
const LoginUser = () => { return(<LoginUserComponent/>) }
import InfoPanelComponent from "@/components/InfoPanel";
const InfoPanel = () => { return(<InfoPanelComponent/>) }

class App extends React.Component {
    public render() {
        return (
            <HashRouter>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={LoginUser}/>
                    <Route exact path="/info-panel" component={InfoPanel}/>
                </Switch>
            </div>
            </HashRouter>
        );
    }
}

export default App;
