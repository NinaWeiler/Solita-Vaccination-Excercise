const vaccinationRouter = require('express').Router()
const Vaccination = require('../models/vaccination')
const {format, parseISO, isBefore} = require('date-fns')

// /api/vaccinations


//get all vaccinations
vaccinationRouter.get('/', async (request, response) => {
    try {
    const vaccinations = await Vaccination.find({}).select('vaccinationDate').lean()
    return response.json(vaccinations)
    } catch (error) {
        response.status(404)
    }
})



/* the following api calls are not used at the moment */ 

//get vaccinations given by selected day
vaccinationRouter.get('/vaccinated/:day', async (request, response) => {
    const vaccinations = await Vaccination.find({})
    const filtered = vaccinations.filter(v => (isBefore(parseISO((v.vaccinationDate).slice(0, -8)), parseISO(request.params.day))))
    //console.log('filtered', filtered) 
    if (filtered.length > 0) {response.json(filtered)
    } else {response.status(404).send({message: 'No vaccinations given on this day'})}
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