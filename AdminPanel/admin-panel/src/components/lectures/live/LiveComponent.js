import React, { Component } from 'react';
import Client from './SocketIOClient';
import { MenuList, MenuItem } from '@material-ui/core';
import socketIOClient from "socket.io-client";
class LiveComponent extends Component {
    state = {
        messages: [],
        socket: {}
    }
    constructor() {
        super();
        const ServerEndpoint = 'https://remote-laboratory.herokuapp.com'
        const socket = socketIOClient(ServerEndpoint);
        this.state = { messages: [], socket: socket };
    }


    messageHandle = (message) => {
        console.log(message)
        let tmp = this.state.messages;
        tmp.push(message);
        this.setState({ messages: tmp });
    }

    componentDidMount() {
        this.state.socket.emit('admin');
    }
    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <Client messagePass={this.messageHandle} socket={this.state.socket} />
                <MenuList>
                    {this.state.messages.map(message => <MenuItem>{message}</MenuItem>)}
                </MenuList>
            </div>
        );
    }
}

export default LiveComponent;