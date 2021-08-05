const mongoose = require('mongoose')
const supertest = require('supertest')
const { initialVaccinations } = require('./test_helper')
const app = require('../app')
const Vaccination = require('../models/vaccination')
const config = require('../utils/config')
const api = supertest(app)

beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
})

beforeEach(async () => {
    await Vaccination.deleteMany({})

    for (let vaccination of initialVaccinations) {
        let vaccinationObject = new Vaccination(vaccination)
        await vaccinationObject.save()
    }

})

describe('For initial vaccinations in db', () => {

    test('all vaccinations are returned', async () => {
        const response = await api.get('/api/vaccinations')
        expect(response.body).toHaveLength(initialVaccinations.length)
    })
    
})

afterAll(() => {
    mongoose.connection.close()
  })