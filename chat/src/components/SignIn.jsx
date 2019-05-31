import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import constants from './Constants';
import Alert from '../components/Alert';

export default class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '',
            email: '',
            password: ''
        };
        this.handleInputEmail= this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push(constants.routes.chat);
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleInputEmail(event) {
        this.setState({ email: event.target.value});
    }

    handleInputPassword(event) {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => 
            this.setState({ errorMessage: error.message})
        );
    }

    render() {
        return (
            <div className="account">
                {this.state.errorMessage ? <Alert errorMessage={this.state.errorMessage} /> : undefined}
                <h1>Husky Chat</h1>
                <form onSubmit={event => this.handleSubmit(event)}>
                    <div className="container">
                        <input id="user" type="Email" placeholder="Email" autoComplete="off" required
                            value={this.state.email}
                            onInput={event => this.handleInputEmail(event)}
                        />
                        <input id="password" type="password" placeholder="Password" required
                            value={this.state.password}
                            onInput={event => this.handleInputPassword(event)}
                        />
                        <button type="submit" className="btn">SIGN IN</button>
                    </div>
                </form>
                <div className="links">
                    <span>Don't have an account?</span>
                    <Link to={constants.routes.signup}>Sign up</Link>
                </div>
            </div>
        );
    }
}