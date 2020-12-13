import React, { useEffect} from 'react';
import socketIOClient from "socket.io-client";
const ServerEndpoint = 'https://remote-laboratory.herokuapp.com'

export default function Client() {
    useEffect(() => {
        const socket = socketIOClient(ServerEndpoint);
        socket.emit('admin')
        socket.on('spy', data => console.log('message from socketio'));
    }, []);

    return (<div>client</div>);
}