var app = require('express')();
var http = require('http').createServer(app);

app.get('/', (req, res) => {
    res.send('<h1>Engineer thesis</h1>');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

http.listen(4000, () => {
    console.log('listening on *:4000');
})