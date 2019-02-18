const os = require("os");

const ETH_IPV4_FAMILY_NAME = "IPv4";

function getIPv4Address({ networkInterfaces }) {
  const eth = networkInterfaces.en0 || networkInterfaces.eth0;

  if (!eth) {
    return null;
  }

  const IPv4 = eth.find(version => version.family === ETH_IPV4_FAMILY_NAME);

  return (IPv4 && IPv4.address) || "0";
}

function host() {
  return {
    hostname: os.hostname(),
    ip: getIPv4Address({ networkInterfaces: os.networkInterfaces() })
  };
}

module.exports = host;
