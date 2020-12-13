import React, { Component, useEffect, useState } from 'react';
import { socketIOClient, io } from "socket.io-client";
const ServerEndpoint = 'https://remote-laboratory.herokuapp.com'

class Client extends Component {
    state = {}

    componentDidMount() {
        const socket = io(ServerEndpoint);
        socket.emit('admin');
        console.log('emit');
        socket.on('spy', data => console.log('message from socketio'));
        socket.on("connect", () => {
            console.log('connect');
        });
        socket.on("connect_error", () => {
            console.log('error');
        });
    }

    render() {
        return (<div>client</div>);
    }
}

export default Client;

/*export default function Client(props) {
    const [response, setResponse] = useState("");
    console.log('Client creation');
    const socket = socketIOClient(ServerEndpoint);
    socket.emit('admin');
    useEffect(() => {
        console.log('useEffect');
        socket.on("spy", data => {
            console.log('Messge from admin');
            console.log(data);
        });
    }, []);

    return ('client')
}*/