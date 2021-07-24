const orderRouter = require('express').Router()
const Order = require('../models/order')
const Vaccination = require('../models/vaccination')
const {format, parseISO, isBefore} = require('date-fns')


// /api/orders

//TODO:

//get all orders

//.select() determines which fields are returned
//.lean() makes the request lighter
orderRouter.get('/', async (request, response) => {
    try {
        const orders = await Order.find({}).select('arrived vaccine injections -_id').lean()
        console.log(orders[1])
        return response.json(orders)
        //if(orders.length > 0) {response.json(orders)} else {return error}
    } catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })

    }
})


// return amount of injections given
const vaccinations = async (id) => {
    const data = await Vaccination.find({sourceBottle: id}).select('vaccinationDate -_id').lean()
    try {
        if(data) {
            return data.length
        } else {return 0}
    } catch (error) {
        { response.status(404).send({error: 'error matching injection to source bottle'})}   
    }

}  

// fetches orders by day and returns each order with info about the given injections
// add error handling!

orderRouter.get('/expanded/:day', async (request, response) => {
    const orders = await Order.find({}).select('arrived vaccine injections injected id -_id')
    const filtered = orders.filter(o => o.arrived.startsWith(request.params.day))
    const expanded = await Promise.all(filtered.map(async f => {
        const data = await vaccinations(f.id)
        return f.injected = data;
    }))
    response.json(filtered)
})


//orders with info by given date not working
orderRouter.get('/expiredby/:day', async (request, response) => {
    const orders = await Order.find({}).select('arrived injections injected id -_id')
    const filtered = orders.filter(o => isBefore(parseISO(o.arrived), parseISO(request.params.day)))
    const expanded = await Promise.all(filtered.map(async f => {
        const data = await vaccinations(f.id)
        return f.injected = data;
    }))
    response.json(filtered)
})


// vaccines arrived on given date
orderRouter.get('/arrived/:day', async (request, response) => {
    const orders = await Order.find({}).select('arrived vaccine injections -_id').lean()
    const filtered = orders.filter(o => o.arrived.startsWith(request.params.day))
    if (filtered.length > 0) {response.json(filtered)
    } else {response.status(404).send({message: 'No orders arrived on given day'})}
 })

orderRouter.get('/Zerpfy', async (request, response) => {
    return null
})

//populate like this maybe
   // const orders = await Order.find({}).populate({ path: 'vaccinations', select: 'id sourceBottle vaccinationDate'}).exec(function(error, orders) {
    //    console.log(orders[8].vaccinations)
        //response.json(orders.map(o => o.toJSON()))
    //    response.json(orders)
   // })

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
    if(data) { response.json(order) }
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



// map the filtered orders and check for id match? 


// should I keep different vaccine types separate? maybe. 
  


module.exports = orderRouter