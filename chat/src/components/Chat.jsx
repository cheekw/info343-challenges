import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/storage";
import { Markdown } from 'react-showdown';
import constants from './Constants';
import Alert from '../components/Alert';
import menuIcon from '../img/menu.png';
import addIcon from '../img/add.svg';
import onlineIcon from '../img/online.svg';
import sendIcon from '../img/send.svg';

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '',
            displayName: '',
            email: '',
            photoUrl: '',
            uid: '',
            currentChannel: 'general'
        };
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleChangeChannel = this.handleChangeChannel.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    handleSignOut() {
        firebase.auth().signOut().catch(error => {
            this.setState({ errorMessage: error.message });
        });
    }

    handleChangeChannel(channelName) {
        this.setState({ currentChannel: channelName });
    }

    getUserInfo(user) {
        this.setState({
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            uid: user.uid
        });
    }

    deleteUser() {
        let user = firebase.auth().currentUser;
        user.delete().then(window.alert('Account deleted')).catch(error =>
            this.setState({ errorMessage: error.message })
        );
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.getUserInfo(user);
            } else {
                this.props.history.push(constants.routes.signin);
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div className="chat-page">
                <div className="chat-page row no-gutters">
                    <div className="col-md-2 no-gutters height">
                        <ChannelsList
                            displayName={this.state.displayName}
                            handleSignOut={() => this.handleSignOut()}
                            deleteUser={() => this.deleteUser()}
                            handleChangeChannel={channelName => this.handleChangeChannel(channelName)}
                        />
                    </div>
                    <div className="no-gutters col-md-10">
                        <div className="messages-col">
                            <div className="push-down"></div>
                            {this.state.errorMessage ? <Alert errorMessage={this.state.errorMessage} /> : undefined}
                            <MessagesView
                                uid={this.state.uid}
                                channels={this.state.channels}
                                currentChannel={this.state.currentChannel}
                            />
                            <MessageInput
                                displayName={this.state.displayName}
                                photoUrl={this.state.photoUrl}
                                uid={this.state.uid}
                                channels={this.state.channels}
                                currentChannel={this.state.currentChannel}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ChannelsList extends Component {
    constructor() {
        super();
        this.state = {
            channels: {}
        };
    }

    componentDidMount() {
        this.channels = firebase.database().ref('messages/');
        this.channels.on('value', snapshot => this.setState({ channels: snapshot.val() }));
    }

    componentWillUnmount() {
        this.channels.off();
    }

    render() {
        return (
            <div className="navbar sticky-top channels-list">
                <h5 className="title">Husky Chat</h5>
                <span id="toggler" className="navbar-dark">
                    <button className="navbar-toggler hides" type="button" data-toggle="collapse" data-target="#channels" aria-controls="navbarSupportedContent"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </span>
                <div id="channels" className="collapse md-shows">
                    <div className="channels-account-items shows">
                        <img className="online-icon" src={onlineIcon} alt="online" />
                        <span>{this.props.displayName}</span>
                        <br />
                        <Link to="/" onClick={() => this.props.handleSignOut()}>
                            Sign out
                        </Link>
                        <br />
                        <Link to="#" onClick={() => this.props.deleteUser()}>
                            Delete account
                        </Link>
                    </div>
                    <h6>Channels</h6>
                    <div className="channels-selection list-group">
                        <div className="channels-item list-group-item active" name="general" data-toggle="list" onClick={() => this.props.handleChangeChannel('general')}>
                            * General
                        </div>
                        <div className="channels-item list-group-item" name="memes" data-toggle="list" onClick={() => this.props.handleChangeChannel('memes')}>
                            * Memes
                        </div>
                        <div className="channels-item list-group-item" name="random" data-toggle="list" onClick={() => this.props.handleChangeChannel('random')}>
                            * Random
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ChannelItem extends Component {
    render() {
        return (
            <div className="channels-item list-group-item active" name={this.props.channel} data-toggle="list" onClick={() => this.props.handleChangeChannel(this.props.channel)}>
                * {this.props.channel}
            </div>
        );
    }
}

class MessagesView extends Component {
    constructor() {
        super();
        this.state = { messages: {} };
    }

    componentWillReceiveProps(nextProps) {
        this.channelMessages = firebase.database().ref('messages/' + nextProps.currentChannel).limitToLast(30);
        this.channelMessages.on('value', snapshot => this.setState({ messages: snapshot.val() }));
    }

    componentWillUnmount() {
        if (firebase.auth().currentUser) {
            this.channelMessages.off();
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.bottom.scrollIntoView();
    }

    render() {
        return (
            <div className="messages-list">
                {
                    this.state.messages ? Object.keys(this.state.messages).map((key, index) =>
                        <Message
                            key={key}
                            messageKey={key}
                            photoUrl={this.state.messages[key].author.photoUrl}
                            displayName={this.state.messages[key].author.displayName}
                            messageBody={this.state.messages[key].body}
                            imageName={this.state.messages[key].image}
                            videoName={this.state.messages[key].video}
                            fileUrl={this.state.messages[key].fileUrl}
                            dateCreated={this.state.messages[key].createdAt}
                            dateEdited={this.state.messages[key].editedAt}
                            messageUid={this.state.messages[key].author.uid}
                            currentUid={this.props.uid}
                            currentChannel={this.props.currentChannel}
                        />
                    ) : undefined
                }
                <div ref={bottom => { this.bottom = bottom }}></div>
            </div>
        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUrl: '',
            editing: false,
            editedMessage: this.props.messageBody
        };
        this.deleteMessage = this.deleteMessage.bind(this);
        this.handleInputNewMessage = this.handleInputNewMessage.bind(this);
        this.handleEditMessage = this.handleEditMessage.bind(this);
        this.stopEditing = this.stopEditing.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this);
        this.handleSaveEdit = this.handleSaveEdit.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
    }

    formatTime(timestamp) {
        let date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let time = hours + ':' + minutes + ' ' + amPm;
        return time;
    }

    deleteMessage(key) {
        firebase.database().ref('messages/' + this.props.currentChannel + '/' + key).remove();
        let storageRef = firebase.storage().ref(this.props.currentChannel + '/');
        if (this.props.imageName) {
            storageRef.child(key + '/' + this.props.imageName).delete();
        } else if (this.props.fileName) {
            storageRef.child(key + '/' + this.props.videoName).delete();
        }
    }

    handleInputNewMessage(event) {
        this.setState({ editedMessage: event.target.value });
    }

    handleEditMessage() {
        this.setState({ editing: true });
        this.messagePost.style = 'background-color: cornsilk';
    }

    stopEditing() {
        this.messageBody.style = undefined;
        this.messagePost.style = undefined;
        this.setState({ editing: false });
    }

    handleCancelEdit() {
        this.stopEditing();
        this.setState({ editedMessage: this.props.messageBody });
    }

    handleSaveEdit() {
        this.updateMessage();
        this.stopEditing();
        this.messageBody.value = this.state.editedMessage;
    }

    updateMessage() {
        let updates = {};
        updates['messages/' + this.props.currentChannel + '/' + this.props.messageKey + '/body'] = this.state.editedMessage;
        updates['messages/' + this.props.currentChannel + '/' + this.props.messageKey + '/editedAt'] = firebase.database.ServerValue.TIMESTAMP;
        firebase.database().ref().update(updates);
    }

    render() {
        return (
            <div className="message-post media" ref={messagePost => this.messagePost = messagePost}>
                <img className="message-image mr-3" src={this.props.photoUrl} alt="husky" />
                <div className="media-body">
                    <div className="message-header">
                        <span className="message-name">{this.props.displayName}</span>
                        {this.props.messageUid === 'hRbkKKqNlaYUL9jieyjCvoi5xv62' ? <span className="admin">(admin)</span> : undefined}
                        <span className="message-time">
                            {this.props.dateEdited ? '(Last edited) ' + this.formatTime(this.props.dateEdited) : this.formatTime(this.props.dateCreated)}
                        </span>
                        <img className="message-options menu-icon" src={menuIcon} alt="options" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu">
                            <div className="dropdown-header">Options</div>
                            {
                                this.props.currentUid === this.props.messageUid || this.props.currentUid === 'hRbkKKqNlaYUL9jieyjCvoi5xv62' ? <div>
                                    <div className="dropdown-item" onClick={() => this.handleEditMessage()}>
                                        Edit
                                    </div>
                                    <div className="dropdown-item" onClick={() => this.deleteMessage(this.props.messageKey)}>
                                        Delete message
                                    </div>
                                </div> : undefined
                            }
                        </div>
                    </div>
                    {
                        this.props.imageName ? <img className="posted-image" src={this.props.fileUrl} alt={this.props.imageName} /> : undefined
                    }
                    {
                        this.props.videoName ? <video className="posted-video" controls>
                            <source src={this.props.fileUrl} alt={this.props.videoName} />
                        </video> : undefined
                    }
                    {
                        this.state.editing ? <textarea className="message-body-edit"
                            ref={messageBody => this.messageBody = messageBody}
                            onChange={event => this.handleInputNewMessage(event)}
                            value={this.state.editedMessage}
                            disabled={!this.state.editing}>
                        </textarea> : <Markdown markup={this.props.messageBody} />
                    }
                    {
                        this.state.editing ? <div className="message-edit-buttons">
                            <button className="btn btn-small" type="button" onClick={() => this.handleCancelEdit()}>Cancel</button>
                            <button className="btn btn-small" type="button" onClick={() => this.handleSaveEdit()}>Save</button>
                        </div> : undefined
                    }
                </div>
            </div>
        );
    }
}

class MessageInput extends Component {
    constructor() {
        super();
        this.state = { message: '' };
        this.handleInputMessage = this.handleInputMessage.bind(this);
        this.handleSendImage = this.handleSendImage.bind(this);
        this.handleSendVideo = this.handleSendVideo.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleSendPost = this.handleSendPost.bind(this);
    }

    handleInputMessage(event) {
        this.setState({ message: event.target.value });
    }

    handleSendImage(event) {
        let file = event.target.files[0];
        this.handleSendMessage(event, file, file.name, '');
        this.imageInput.value = '';
    }

    handleSendVideo(event) {
        let file = event.target.files[0];
        this.handleSendMessage(event, file, '', file.name);
        this.videoInput.value = '';
    }

    handleSendMessage(event, file, imageName, videoName) {
        event.preventDefault()
        let key = firebase.database().ref().child('messages/' + this.state.currentChannel).push().key;
        if (this.state.message || file) {
            if (file) {
                let storageRef = firebase.storage().ref(this.props.currentChannel + '/' + key).child(file.name);
                storageRef.put(file).then(snapshot => this.handleSendPost(key, snapshot.downloadURL, imageName, videoName));
            } else {
                this.handleSendPost(key, '', imageName, videoName);
            }
        }
    }

    handleSendPost(key, url, imageName, videoName) {
        let messageData = {
            author: {
                displayName: this.props.displayName,
                photoUrl: this.props.photoUrl,
                uid: this.props.uid
            },
            body: this.state.message,
            fileUrl: url,
            image: imageName,
            video: videoName,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            editedAt: ''
        };
        let updates = {};
        updates['messages/' + this.props.currentChannel + '/' + key] = messageData;
        firebase.database().ref().update(updates);
        this.setState({ message: '' });
    }

    render() {
        return (
            <form className="input-group message-input" onSubmit={event => this.handleSendMessage(event, '', '', '')}>
                <input type="text" className="input messages-input" placeholder="Message..."
                    value={this.state.message}
                    onInput={event => this.handleInputMessage(event)}
                />
                <span className="input-group-btn dropup">
                    <button className="btn btn-input shows" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="add-icon" alt="add media" src={addIcon} />
                    </button>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu">
                        <div className="dropdown-item" onClick={() => this.imageInput.click()}>Image</div>
                        <div className="dropdown-item" onClick={() => this.videoInput.click()}>Video</div>
                    </div>
                    <button className="btn btn-input" type="submit">
                        <img className="send-icon" src={sendIcon} alt="send" />
                    </button>
                </span>
                <input type="file" accept="image/*"
                    ref={imageInput => this.imageInput = imageInput}
                    onChange={event => this.handleSendImage(event)}
                />
                <input type="file" accept="video/*"
                    ref={videoInput => this.videoInput = videoInput}
                    onChange={event => this.handleSendVideo(event)}
                />
            </form>
        );
    }
}