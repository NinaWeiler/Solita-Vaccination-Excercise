const orderRouter = require('express').Router()
const Order = require('../models/order')
const Vaccination = require('../models/vaccination')
const { parseISO, isBefore, isSameDay, subDays, addDays, isValid } = require('date-fns')


// /api/orders

//.select() determines which fields are returned
//.lean() makes the request lighter

//get all orders
orderRouter.get('/', async (request, response) => {
    try {
        const orders = await Order.find({}).select('arrived id vaccine injections -_id').lean()
        return response.json(orders)
        //if(orders.length > 0) {response.json(orders)} else {return error}
    } catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })

    }
})

orderRouter.get('/all', async (request, response) => {
    try {
        const orders = await Order.find({})
        return response.json(orders)
        //if(orders.length > 0) {response.json(orders)} else {return error}
    } catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })

    }
})

//helper function
//return array of given injections
const vaccinations = async (id) => {
    const data = await Vaccination.find({sourceBottle: id}).select('vaccinationDate -_id').lean()
    try {
        if(data) {
            return data
        } else {return 0}
    } catch (error) {
        { response.status(404).send({error: 'error matching injection to source bottle'})}   
    }

}  

// injections expiring in 10 days 
orderRouter.get('/exp10/:day', async (request, response) => {
    const isValidDate = isValid(parseISO(request.params.day))
    try { 
        if (isValidDate === true) {
        const orders = await Order.find({}).select('arrived vaccine injections vaccines id -_id')
        //find orders that arrived 20 days before selected day
        const filtered = orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(request.params.day), 20)))
        const expanded = await Promise.all(filtered.map(async f => {
            const data = await vaccinations(f.id)
            const filterGiven = data.filter(d => isBefore(parseISO((d.vaccinationDate).slice(0, -8)), addDays(parseISO(request.params.day), 1)))
            return f.vaccines.push(filterGiven.length)
        }))
        response.json(filtered) 
        } else { return error } 
    } catch (error) {
        response.status(404).send({ error: 'invalid date'})
    }
})

//expired today
//find amount of orders and injections arrived 30 days ago, substact amount of vaccines injected
//return amount of injections expired
orderRouter.get('/expired/:day', async (request, response) => {
    const isValidDate = isValid(parseISO(request.params.day))
    try {
        if (isValidDate) {
        const orders = await Order.find({}).select('arrived injections expired vaccine id -_id')
        const filtered = orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(request.params.day), 30)))
        const expanded = await Promise.all(filtered.map(async f => {
            const data = await vaccinations(f.id)
            return f.expired = f.injections - data.length;
        }))
        response.json(filtered)
        } else { return error }
    } catch (error) {
        response.status(404).send({ error: 'invalid date'})
    }
})



/* The following api calls take too long to process, or calling them as many times as needed
    would be too much, so they are left out for a better user experience. */


//returns info for calculating orders expired by given day in total
//returns object with arrival day, amount of injections and amount of used injections
orderRouter.get('/expiredby/:day', async (request, response) => {
    const orders = await Order.find({}).select('arrived injections injected id -_id')
    const filtered = orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(request.params.day), 30)))
    const expanded = await Promise.all(filtered.map(async f => {
        const data = await vaccinations(f.id)
        return f.injected = data.length;
    }))
    response.json(filtered)
})

//finds object by bottle id, returns order object with a vaccines array with each given vaccination and their dates 
orderRouter.get('/fullInfo/:id', async (request, response) => {
    try {
    const order = await Order.find({id: request.params.id}).select('arrived injections vaccines id -_id')
    const vaccines = await Vaccination.find({sourceBottle: request.params.id}).select('sourceBottle vaccinationDate -_id').lean()
    //adds all objects in the array
    const data = order[0].vaccines.push(...vaccines)
    if(data) { response.json(order) }
    } 
    catch (error) { response.status(404).send({error: 'not found'})}
})


//find specific bottle by id and return amount of injections that expired from that bottle
orderRouter.get('/bottle/:id', async (request, response) => {
    const order = await Order.find({id : request.params.id}).select('injections expired id -_id').lean()
    const injected = await Vaccination.find({sourceBottle: request.params.id}).select('vaccinationDate -_id').lean()
    order[0].expired = order[0].injections - injected.length
    response.json(order[0].expired)
})

//returns all orders arrived on given date
orderRouter.get('/arrivaldate/:day', async (request, response) => {
    const orders = await Order.find({}).select('arrived vaccine injections -_id').lean()
    const filtered = orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), (parseISO(request.params.day))))
    if (filtered.length > 0) {response.json(filtered)
    } else {response.status(404).send({message: 'No orders arrived on given day'})}
 })



module.exports = orderRouter