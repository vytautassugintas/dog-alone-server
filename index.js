const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { saveDecibels, getDecibels, getLastDecibelRecord } = require('./src/decibelsRepository');
const { addClient, removeClient } = require('./src/clients');

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
    const { client } = socket;
    addClient(client.id);

    socket.on('disconnect', () => {
        removeClient(client.id);
    });

    socket.emit('decibelsLog', {
      history: getDecibels().slice(0, 50)
    });

    socket.on('decibelIncrease', (data = {}) => {
        const { dbLevel } = data;
        saveDecibels({dbLevel});
       
        io.emit('decibelIncreased', getLastDecibelRecord());
    });
});

http.listen(PORT, () => {
    console.info(`listening on ${PORT}`);
});
