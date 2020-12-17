import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
const ServerEndpoint = 'https://remote-laboratory.herokuapp.com'

export default function Client(props) {
    useEffect(() => {
        const socket = socketIOClient(ServerEndpoint);
        socket.emit('admin')
        socket.on('spy', data => {
            props.messagePass(data)
            console.log(data);
        })
    })

    return (<div></div>);
}