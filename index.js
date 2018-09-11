const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ decibels: []}).write()

const {
    addClient,
    removeClient
} = require('./src/clients');

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
    const { client } = socket;
    addClient(client.id);

    socket.on('disconnect', () => {
        removeClient(client.id);
    });

    socket.on('decibelIncrease', (data = {}) => {
        const { dbLevel } = data;
        const date = moment();
        db.get('decibels')
            .push({ 
                dbLevel: dbLevel,
                date: date.format('x'),
                displayDate: date.format('MMMM Do YYYY, h:mm:ss a'),
            })
            .write()

        // it should send data to specfic client, that was saved earlier
        // but as I'm the only client now its ok to broadcast to all
        socket.broadcast.emit('decibelIncreased', {
            message: `current dB level ${dbLevel}`
        })
    });

});

http.listen(PORT, () => {
    console.log('listening on *:3000');
});
