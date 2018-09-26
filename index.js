const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { saveDecibels, getDecibels, getLastDecibelRecord } = require('./src/decibelsRepository');
const { addClient, removeClient } = require('./src/clients');

const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = process.env.PORT || 3000;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '/graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use(GRAPHQL_ENDPOINT, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

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
    console.info(`listening on port: ${PORT}`);
    console.info(`graphql endpoint: ${GRAPHQL_ENDPOINT}`);
});
