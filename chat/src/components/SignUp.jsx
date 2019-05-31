import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import md5 from 'blueimp-md5';
// import constants from './Constants';
// import Alert from '../components/Alert';

export default class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '',
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
        this.handleInputDisplayName = this.handleInputDisplayName.bind(this);
        this.handleInputEmail = this.handleInputEmail.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.handleInputPasswordConfirmation = this.handleInputPasswordConfirmation.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    getEmailHash() {
        return md5(this.state.email.trim().toLowerCase());
    }

    handleInputDisplayName(event) {
        this.setState({ displayName: event.target.value });
    }

    handleInputEmail(event) {
        this.setState({ email: event.target.value });
    }

    handleInputPassword(event) {
        this.setState({ password: event.target.value });
    }

    handleInputPasswordConfirmation(event) {
        this.setState({ confirmPassword: event.target.value });
    }

    handleSubmitForm(event) {
        event.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ errorMessage: 'Passwords do not match.' })
        } else {
            let hash = this.getEmailHash();
            // let defaultImageUrl = this.getRandomImage();
            // let url = 'https://www.gravatar.com/avatar/' + hash + "?d=" + encodeURIComponent(defaultImageUrl);
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(user => {
                user.updateProfile({
                    displayName: this.state.displayName,
                    // photoURL: url
                }).then(() => {
                    // this.props.history.push(constants.routes.landing);
                    window.location.reload()
                }).catch(error => this.setState({ errorMessage: error.message }));
            }).catch(error => this.setState({ errorMessage: error.message }));
        }
    }

    render() {
        return (
            <div className="account">
                {/* {this.state.errorMessage ? <Alert errorMessage={this.state.errorMessage} /> : undefined}  */}
                <h1>Husky Chat</h1>
                <form onSubmit={event => this.handleSubmitForm(event)}>
                    <div className="container">
                        <input id="displayName" type="text" placeholder="Display Name" autoComplete="off" required
                            value={this.state.displayName}
                            onInput={event => this.handleInputDisplayName(event)}
                        />
                        <input id="user" type="Email" placeholder="Email" autoComplete="off" required
                            value={this.state.email}
                            onInput={event => this.handleInputEmail(event)}
                        />
                        <input id="password" type="password" placeholder="Password" required minLength="6"
                            value={this.state.password}
                            onInput={event => this.handleInputPassword(event)}
                        />
                        <input id="confirmPassword" type="password" placeholder="Confirm Password" required minLength="6"
                            value={this.state.confirmPassword}
                            onInput={event => this.handleInputPasswordConfirmation(event)}
                        />
                        <button type="submit" className="btn">CREATE ACCOUNT</button>
                    </div>
                    <div className="links">
                        <span>Already have an account?</span>
                        {/* <Link to={constants.routes.signin}>Sign in</Link> */}
                    </div>
                </form>
            </div>
        );
    }
}

