const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    id: String,
    orderNumber: Number,
    responsiblePerson: String,
    healthCareDistrict: String,
    vaccine: String,
    injections: Number,
    arrived: String,
    injected: Number,
    expired: Number,
    vaccines: Array
  }, { toJSON: { virtuals: true }})


  orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Order', orderSchema)