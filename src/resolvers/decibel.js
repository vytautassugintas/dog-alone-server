const { getDecibels } = require("../decibelsRepository");

function decibels(args) {
  const { count } = args;
  return getDecibels({ count });
}

module.exports = {
  decibels
};
