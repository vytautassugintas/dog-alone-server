const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const {
    getClients,
    addClient,
    removeClient
} = require('./src/clients');

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


io.on('connection', socket => {
    const { client } = socket;
    addClient(client.id);

    socket.on('disconnect', () => {
        removeClient(client.id);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
