import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// ==================== Component ==================== 
import LoginUserComponent from "@/components/LoginUser";
const LoginUser = () => { return(<LoginUserComponent/>) }
import MainPageComponent from "@/components/MainPage";
const MainPage = () => { return(<MainPageComponent/>) }

class App extends React.Component {
    public render() {
        return (
            <HashRouter>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={LoginUser}/>
                    <Route exact path="/main-page" component={MainPage}/>
                </Switch>
            </div>
            </HashRouter>
        );
    }
}

export default App;
