const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    id: String,
    orderNumber: Number,
    responsiblePerson: String,
    healthCareDistrict: String,
    vaccine: String,
    injections: Number,
    arrived: String,
    vaccinations: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vaccination'
    }
    ]
  })

  orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      //returnedObject.id = returnedObject._id.toString()
      //delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Order', orderSchema)