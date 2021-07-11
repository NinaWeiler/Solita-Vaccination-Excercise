const orderRouter = require('express').Router()
const Order = require('../models/order')
const Vaccination = require('../models/vaccination')

// /api/orders

//TODO:
//get orders and orderd them by arrival date


orderRouter.get('/', async (request, response) => {
   // const orders = await Order.find({}).populate({ path: 'vaccinations', select: 'id sourceBottle vaccinationDate'}).exec(function(error, orders) {
    //    console.log(orders[8].vaccinations)
        //response.json(orders.map(o => o.toJSON()))
    //    response.json(orders)
   // })
    try {
        const orders = await Order.find({}).select('arrived vaccine injections')
        console.log(orders[1])
        if(orders.length > 0) {response.json(orders)} else {return error}
    } catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })

    }
})

orderRouter.get('/sorted', async (request, response) => {
    const orders = await Order.find({})
        
    response.json(orders.sort((function(a,b) {
        a = new Date(a.arrived)
        b = new Date(b.arrived)
        return a - b
    })))
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
    try {
    const order = await Order.find({id: request.params.id})
    const vaccines = await Vaccination.find({sourceBottle: request.params.id})
    console.log('order', order[0])
    console.log('vaccinations', vaccines)
    //adds all objects in the array
    const data = order[0].vaccines.push(...vaccines)
    if(data) { response.json(order) } else {return error}
    } 
    catch (error) { response.status(404).send({error: 'not found'})}
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

// map the filtered orders and check for id match? 

const vaccinations = async (id) => {
    const data = await Vaccination.find({sourceBottle: id})
    try {
        if(data) {
            //const result = data.map(d => d.toJSON())
            //console.log('result',result)
            //console.log('data', data[0])
            return data
        } else {return []}
    } catch (error) {
        { response.status(404).send({error: 'error matching injection to source bottle'})}   
    }

}  

// fetches orders by day and returns each order with info about the given injections
//could change to Order.find({arrived: startsWith(day)})
orderRouter.get('/expanded/:day', async (request, response) => {
    const orders = await Order.find({})
    const filtered = orders.filter(o => o.arrived.startsWith(request.params.day))
    const expanded = await Promise.all(filtered.map(async f => {
        const data = await vaccinations(f.id)
        return f.vaccines.push(data)
    }))
    response.json(filtered)
})
// should I keep different vaccine types separate? maybe. 
  


module.exports = orderRouter