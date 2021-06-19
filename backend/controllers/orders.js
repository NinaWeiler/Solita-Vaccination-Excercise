const orderRouter = require('express').Router()
const Order = require('../models/order')

// /api/orders

orderRouter.get('/', (request, response) => {
    Order
    .find({})
    .then(orders => {
      response.json(orders)
    })
})

orderRouter.get('/:id', (request, response) => {
    Order.findById(request.params.id).then(order => {
        response.json(order)
    })
})

orderRouter.post('/', (request, response) => {
    const body = request.body
  
    if (body.id === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const order = new Order({
        id: body.id,
        orderNumber: body.orderNumber,
        responsiblePerson: body.responsiblePerson,
        healthCareDistrict: body.healthCareDistrict,
        vaccine: body.vaccine,
        injections: body.injections,
        arrived: body.arrived
    })
  
    order.save().then(savedOrder => {
      response.json(savedOrder)
    })
  })
  
module.exports = orderRouter