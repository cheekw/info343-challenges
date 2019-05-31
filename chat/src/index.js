import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';

var config = {
    apiKey: "AIzaSyBI8OPHwHv8BRBpBUzR89CVy6n5UTYEKmA",
    authDomain: "info-343-chat-9e79a.firebaseapp.com",
    databaseURL: "https://info-343-chat-9e79a.firebaseio.com",
    projectId: "info-343-chat-9e79a",
    storageBucket: "info-343-chat-9e79a.appspot.com",
    messagingSenderId: "844955913784"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
