const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('new client');

    let token;
    let commands = '';

    socket.on('access_token', (tok) => {
        console.log(`Token: ${tok}`);
        token = tok;
    })

    socket.on('command', (command) => {
        console.log(`Command: ${command}`);
        commands = `${commands}\n${command}`;
        socket.emit('output', commands);
    })

    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });
})

http.listen(3001, () => console.log(`Listening`));