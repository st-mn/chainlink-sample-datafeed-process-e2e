/**
 * External adapter to fetch ETH/USD data from CoinApi using the Chainlink external adapter framework.
 * Adapters are services which the core of the Chainlink node communicates via its API with a simple JSON specification.
 * This adapter utilizes the Chainlink Requester and Validator classes to interact with API.
 * It defines custom error scenarios and custom parameters specific to the API.
 *
 * The createRequest function takes an input object containing the request parameters and a callback function.
 * It validates the input data, constructs the API request URL and parameters, and sends the request using the Requester.
 * It handles both successful and error responses, returning the appropriate data to the callback function.
 *
 * The adapter provides wrappers for GCP Functions, AWS Lambda, and newer AWS Lambda implementations.
 * It also exposes the createRequest function for testing and running in Express applications.
 *
 * Test the adapter and pull data with CURL command
 * Once adapter is tested and working we can host it on our node or ask node providers to host it for us.
 *
 */

// Use chainlink external adapter.
const { Requester, Validator } = require('@chainlink/external-adapter')


// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  base: ['base', 'from', 'coin'],
  quote: ['quote', 'to', 'market']
}

// Define request to the API. 
// The Validator helps you validate the Chainlink request data
const createRequest = (input, callback) => {
  const validator = new Validator(input, customParams, callback)
  const jobRunID = validator.validated.id
  const coin = validator.validated.data.base
  const market = validator.validated.data.quote
  const url = `https://rest.coinapi.io/v1/exchangerate/${coin}/${market}`
  const options = {
    url,
    qs: {
      apikey: process.env.API_KEY
    }
  }
  Requester.requestRetry(options)
    .then(response => {
      response.body.result = Requester.validateResult(response.body, ['rate'])
      callback(response.statusCode, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
