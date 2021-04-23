import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Dispatch } from 'redux';

import { IRootState } from '@/utils/store/store';
import * as actions from '@/utils/store/actions';
import { UserActions } from '@/utils/store/types';

import { User } from '@/classes/User';

const mapStateToProps = ({ user_reducer }: IRootState) => {
    const { user } = user_reducer;
    return { user };
}

const mapDispatcherToProps = (dispatch: Dispatch<UserActions>) => {
    return {
        saveUser: (user: User) => dispatch(actions.saveUser(user))
    }
}

type ReduxType = ReturnType<typeof mapStateToProps> & 
    ReturnType<typeof mapDispatcherToProps>;

// ==================== Component ==================== 
import { LoginUser as LoginUserComponent } from "@/components/LoginUser";
const LoginUser = () => { return(<LoginUserComponent/>) }
import { InfoPanel as InfoPanelComponent } from "@/components/InfoPanel";
import { connect } from 'react-redux';
const InfoPanel = () => { return(<InfoPanelComponent/>) }

class App extends React.Component<ReduxType> {
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

export default connect(mapStateToProps, mapDispatcherToProps) (App);
