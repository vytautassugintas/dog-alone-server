const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const os = require("os");
const {
  saveDecibels,
  getDecibels,
  getLastDecibelRecord
} = require("./src/decibelsRepository");
const { addClient, removeClient } = require("./src/clients");

const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const PORT = process.env.PORT || 3000;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/graphql";

const schema = buildSchema(`
  type Query {
    hello: String
    host: Host
  }

  type Host {
    hostname: String
    ip: String
  }
`);

function getIPv4Address({ networkInterfaces }) {
  if (!networkInterfaces.en0) {
    // not a mac
    return "0";
  }

  const eth = networkInterfaces.en0;
  const IPv4 = eth.find(version => version.family === "IPv4");
  return (IPv4 && IPv4.address) || "0";
}

const root = {
  hello: () => {
    return "Hello world!";
  },
  host: () => {
    return {
      hostname: os.hostname(),
      ip: getIPv4Address({ networkInterfaces: os.networkInterfaces() })
    };
  }
};

app.use(
  GRAPHQL_ENDPOINT,
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

io.on("connection", socket => {
  const { client } = socket;
  addClient(client.id);

  socket.on("disconnect", () => {
    removeClient(client.id);
  });

  socket.emit("decibelsLog", {
    history: getDecibels().slice(0, 50)
  });

  socket.on("decibelIncrease", (data = {}) => {
    const { dbLevel } = data;
    saveDecibels({ dbLevel });

    io.emit("decibelIncreased", getLastDecibelRecord());
  });
});

http.listen(PORT, () => {
  console.info(`listening on port: ${PORT}`);
  console.info(`graphql endpoint: ${GRAPHQL_ENDPOINT}`);
});
