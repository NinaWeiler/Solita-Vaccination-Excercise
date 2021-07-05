const vaccinationRouter = require('express').Router()
const Vaccination = require('../models/vaccination')

// /api/orders

vaccinationRouter.get('/', async (request, response) => {
    const vaccinations = await Vaccination.find({})
    response.json(vaccinations)
    
})

//vaccination id
vaccinationRouter.get('/:id', async (request, response) => {
    try {
        const vaccination = await Vaccination.find({'vaccination-id': request.params.id})
        if(vaccination.length > 0) {response.json(vaccination)} else {return error}
    } 
    catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })
    }
})

//bottle id
vaccinationRouter.get('/bottle/:id', async (request, response) => {
    try {
        const vaccination = await Vaccination.find({'sourceBottle': request.params.id})
        if(vaccination.length > 0) {response.json(vaccination)} else {return error}
    } 
    catch (error) {
        response.status(404).send({ error: 'unknown endpoint' })
    }
})

module.exports = vaccinationRouter