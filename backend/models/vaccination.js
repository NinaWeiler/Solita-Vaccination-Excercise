const mongoose = require('mongoose')

const vaccinationSchema = new mongoose.Schema({
    'vaccination-id': String,
    gender: String,
    sourceBottle: String,
    vaccinationDate: String,
  })

  
  vaccinationSchema.virtual('orders', {
    ref: 'Order',
    localField: 'sourceBottle',
    foreignField: 'id',
    justOne: false,
  })
  
  vaccinationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Vaccination', vaccinationSchema)