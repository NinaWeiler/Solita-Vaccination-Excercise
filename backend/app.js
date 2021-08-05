const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const compression = require('compression')
const app = express()
const cors = require('cors')
const orderRouter = require('./controllers/orders')
const vaccinationRouter = require('./controllers/vaccinations')
const middleware = require('./utils/middleware')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use(compression())
app.use('/api/orders', orderRouter)
app.use('/api/vaccinations', vaccinationRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
