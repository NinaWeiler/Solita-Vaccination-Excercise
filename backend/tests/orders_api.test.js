const mongoose = require('mongoose')
const supertest = require('supertest')
const { initialOrders, initialVaccinations } = require('./test_helper')
const app = require('../app')
const Vaccination = require('../models/vaccination')
const Order = require('../models/order')
const config = require('../utils/config')
const api = supertest(app)

beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
})

beforeEach(async () => {
    await Vaccination.deleteMany({})
    await Order.deleteMany({})

    for (let order of initialOrders) {
        let orderObject = new Order(order)
        await orderObject.save()
    }

    for (let vaccination of initialVaccinations) {
        let vaccinationObject = new Vaccination(vaccination)
        await vaccinationObject.save()
    }

})

describe('For initial orders in db', () => {

    test('all orders are returned', async () => {
        const response = await api.get('/api/orders')
        expect(response.body).toHaveLength(initialOrders.length)
    })
    
})

afterAll(() => {
    mongoose.connection.close()
  })