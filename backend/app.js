const path = require('path')
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
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.use(express.static(buildPath))
app.use(express.json())
app.use(middleware.requestLogger)

app.use(compression())
app.use('/api/orders', orderRouter)
app.use('/api/vaccinations', vaccinationRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
