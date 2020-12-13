import React, { Component } from 'react';
import Client from './SocketIOClient';
class LiveComponent extends Component {
    state = {}
    render() {
        return (
            <Client />
        );
    }
}

export default LiveComponent;