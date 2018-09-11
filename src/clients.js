const socketClients = [];

const addClient = id => {
    socketClients.push(id);
}

const removeClient = id => {
    const removeId = socketClients.indexOf(id);
    socketClients.splice(removeId, 1);
}

const getClients = () => {
  return socketClients;
}

module.exports = {
  addClient,
  removeClient,
  getClients
}
