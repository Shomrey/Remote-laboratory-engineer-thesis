import React, { Component } from 'react';
import Client from './SocketIOClient';
import { MenuList, MenuItem } from '@material-ui/core';
class LiveComponent extends Component {
    state = {
        messages: []
    }

    messageHandle = (message) => {
        console.log(message)
        let tmp = this.state.messages;
        tmp.push(message);
        this.setState({ messages: tmp });
    }
    render() {
        return (
            <div>
                <Client messagePass={this.messageHandle} />
                <MenuList>
                    {this.state.messages.map(message => <MenuItem>{message}</MenuItem>)}
                </MenuList>
            </div>
        );
    }
}

export default LiveComponent;