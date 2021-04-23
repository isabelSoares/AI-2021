import React from 'react';
import {HashRouter,Route,Switch} from 'react-router-dom';

// ==================== Component ==================== 
import { LoginUser as LoginUserComponent } from "@/components/LoginUser";
const LoginUser = () => { return(<LoginUserComponent/>) }
import { InfoPanel as InfoPanelComponent } from "@/components/InfoPanel";
const InfoPanel = () => { return(<InfoPanelComponent/>) }

const App = () => {
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

export default App;
