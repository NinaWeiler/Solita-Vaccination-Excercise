const orderRouter = require('express').Router()
const Order = require('../models/order')
const Vaccination = require('../models/vaccination')

// /api/orders

orderRouter.get('/', async (request, response) => {
    const orders = await Order.find({})
    response.json(orders)
    
})

//bottle id
orderRouter.get('/:id', async (request, response) => {
    try {
        const order = await Order.find({id: request.params.id})
        if(order.length > 0) {response.json(order)} else {return error}
    } 
    catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })
    }
})

//orders and vaccinations
orderRouter.get('/combined/:id', async (request, response) => {
    const order = await Order.find({id: request.params.id})
    const vaccinations = await Vaccination.find({sourceBottle: request.params.id})
    console.log('order', order[0])
    console.log('vaccinations', vaccinations)
    //returns only first of array, fix this!
    const data = order[0].vaccinations.push(vaccinations[0])
    response.json(order)
})

//order number
orderRouter.get('/n/:orderNumber', async (request, response) => {
    const orderNumber = request.params.orderNumber
    const orders = await Order.find({orderNumber: orderNumber})
    if (orders.length > 0) {response.json(orders)
    } else response.status(404).send({error: 'Cannot find order with given number'})
    
})

// vaccines arrived by given date
orderRouter.get('/arrived/:day', async (request, response) => {
    const orders = await Order.find({})
    const filtered = orders.filter(o => o.arrived.startsWith(request.params.day))
    //console.log('filtered', filtered) 
    if (filtered.length > 0) {response.json(filtered)
    } else {response.status(404).send({message: 'No orders arrived on given day'})}
 })
  
module.exports = orderRouter