const orderRouter = require('express').Router()
const Order = require('../models/order')

// /api/orders

orderRouter.get('/', async (request, response) => {
    const orders = await Order.find({})
    response.json(orders)
    
})

//bottle id
orderRouter.get('/:id', async (request, response) => {
    try {
        const order = await Order.find({id: request.params.id})
        response.json(order)
    } 
    catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })
    }
})

//order number
orderRouter.get('/n/:orderNumber', async (request, response) => {
    const orderNumber = request.params.orderNumber
    const orders = await Order.find({orderNumber: orderNumber})
    if (orders.length > 0) {response.json(orders)
    } else response.status(404).send({error: 'Cannot find order with given number'})
    
})

// vaccines arrived by given date, can be done in front end
orderRouter.get('/arrived/:day', async (request, response) => {
    // const orders = await Order.find({})
    // const filtered = orders.filter(o => o.arrived.startsWith(request.params.day))
     //console.log('filtered', filtered)
     try {
         const orders = await Order.find({arrived : startsWith(request.params.day)})
     }
     catch(error) {console.log(error)}
 })
  
module.exports = orderRouter