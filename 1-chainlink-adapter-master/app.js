/**
 * Express application to handle incoming requests and communicate with the external adapter.
 *
 * This application utilizes the 'dotenv' package to load environment variables from a '.env' file.
 * It also imports the 'createRequest' function from the 'index' module, which is responsible for generating
 * and sending HTTP requests to the  API.
 *
 * The Express application defines two endpoints:
 *
 * 1. POST /: This endpoint receives a JSON body containing the request parameters.
 *    It then calls the 'createRequest' function to fetch the weather data and returns the response to the client.
 *
 * 2. GET /health: This endpoint returns a simple 'OK' response to indicate that the application is healthy.
 *
 * The application listens on the port specified by the EA_PORT environment variable or defaults to port 8080.
 */



const dotenv = require("dotenv").config();
const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080

app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})
app.listen(port, () => console.log(`Listening on port ${port}!`))

// curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": { "from": "ETH", "to": "USD" } }'
