import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
const ServerEndpoint = 'https://remote-laboratory.herokuapp.com'

export default function Client(props) {
    useEffect(() => {
        const socket = props.socket;
        //socket.emit('admin')
        console.log(socket);
        socket.on('spy', data => {
            props.messagePass(data)
            console.log(data);
        })
    })

    return (<div></div>);
}