import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Chat from './components/Chat';
import constants from './components/Constants';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/" render={() =>
                            <Redirect to={constants.routes.signin} />
                        } />
                        <Route path={constants.routes.signin} component={SignIn} />
                        <Route path={constants.routes.signup} component={SignUp} />
                        <Route path={constants.routes.chat} component={Chat} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;