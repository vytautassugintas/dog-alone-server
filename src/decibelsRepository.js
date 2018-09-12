const moment = require('moment');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ decibels: []}).write()

const saveDecibels = ({ dbLevel }) => {
  const date = moment();
  db.get('decibels').push({
      dbLevel: dbLevel,
      date: date.format('x'),
      displayDate: date.format('MMMM Do YYYY, h:mm:ss a'),
  }).write();
}

const getDecibels = () => {
  return db.get('decibels').values();
}

module.exports = {
  saveDecibels,
  getDecibels,
}
