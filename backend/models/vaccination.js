const mongoose = require('mongoose')

const vaccinationSchema = new mongoose.Schema({
    'vaccination-id': String,
    gender: String,
    sourceBottle: String,
    vaccinationDate: String,
  })

  vaccinationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      //delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Vaccination', vaccinationSchema)