const moment = require('moment');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ decibels: []}).write()

const saveDecibels = ({ dbLevel }) => {
  const date = moment();
  db.get('decibels').unshift({
      dbLevel: dbLevel,
      date: date.format('x'),
      displayDate: date.format('MMMM Do YYYY, h:mm:ss a'),
  }).write();
}

const getLastDecibelRecord = () => db.get('decibels').first().value()

const getDecibels = () => {
  return db.get('decibels').value();
}

module.exports = {
  saveDecibels,
  getDecibels,
  getLastDecibelRecord,
}
