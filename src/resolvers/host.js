const os = require("os");

const ETH_IPV4_FAMILY_NAME = "IPv4";
const ETH_IPV6_FAMILY_NAME = "IPv6";

function getIPAddress({ versionName }) {
  const interfaces = os.networkInterfaces();

  if (!interfaces) {
    return null;
  }

  for (key in interfaces) {
    const interface = interfaces[key];

    const isEligibleInterface = version =>
      version && !version.internal && version.family === versionName;

    const eligibleInterface = interface.find(isEligibleInterface);

    if (eligibleInterface) {
      return eligibleInterface.address;
    }
  }

  return null;
}

function host() {
  return {
    hostname: os.hostname(),
    ipv4: getIPAddress({ versionName: ETH_IPV4_FAMILY_NAME }),
    ipv6: getIPAddress({ versionName: ETH_IPV6_FAMILY_NAME })
  };
}

module.exports = host;
