const vaccinationRouter = require('express').Router()
const Vaccination = require('../models/vaccination')

// /api/vaccinations

//TODO:
//get vaccinations and order them by vaccination date

vaccinationRouter.get('/', async (request, response) => {
    const vaccinations = await Vaccination.find({}).select('sourceBottle vaccinationDate orders').populate({ path: 'orders', select: 'sourceBottle id'}).exec(function(error, vaccinations) {
        response.json(vaccinations.map(v => v.toJSON()))
    })
    
})

vaccinationRouter.get('/sorted', async (request, response) => {
    const vaccinations = await Vaccination.find({})
        
    response.json(vaccinations.sort((function(a,b) {
        a = new Date(a.vaccinationDate)
        b = new Date(b.vaccinationDate)
        return a - b
    })))
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

vaccinationRouter.get('/vaccinated/:day', async (request, response) => {
    const vaccinations = await Vaccination.find({})
    const filtered = vaccinations.filter(v => v.vaccinationDate.startsWith(request.params.day))
    //console.log('filtered', filtered) 
    if (filtered.length > 0) {response.json(filtered)
    } else {response.status(404).send({message: 'No vaccinations given on this day'})}
 })

module.exports = vaccinationRouter