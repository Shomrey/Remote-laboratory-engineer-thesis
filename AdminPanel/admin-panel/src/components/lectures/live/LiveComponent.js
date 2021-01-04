import React, { Component } from 'react';
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
        console.log(this.state.messages)
        let tmp = this.state.messages;
        tmp.push(message);
        this.setState({ messages: tmp });
    }

    componentDidMount() {
        this.state.socket.emit('admin');
        this.state.socket.on('spy', data => {
            this.messageHandle(data);
            console.log('I got message in parent');
            console.log(data);
        })
    }
    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <MenuList>
                    {this.state.messages.map(message => <MenuItem>{message}</MenuItem>)}
                </MenuList>
            </div>
        );
    }
}

export default LiveComponent;