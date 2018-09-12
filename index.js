const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { saveDecibels } = require('./src/decibelsRepository');
const { addClient, removeClient } = require('./src/clients');

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
    const { client } = socket;
    addClient(client.id);

    socket.on('disconnect', () => {
        removeClient(client.id);
    });

    socket.on('decibelIncrease', (data = {}) => {
        const { dbLevel } = data;
        saveDecibels({dbLevel});
        socket.broadcast.emit('decibelIncreased', {
            message: `current dB level ${dbLevel}`
        });
    });
});

http.listen(PORT, () => {
    console.info(`listening on ${PORT}`);
});
