/**
 * External adapter to fetch weather data from OpenWeatherMap using the Chainlink external adapter framework.
 * Adapters are services which the core of the Chainlink node communicates via its API with a simple JSON specification.
 * This adapter utilizes the Chainlink Requester and Validator classes to interact with OpenWeatherMap API.
 * It defines custom error scenarios and custom parameters specific to the OpenWeatherMap API.
 *
 * The createRequest function takes an input object containing the request parameters and a callback function.
 * It validates the input data, constructs the API request URL and parameters, and sends the request using the Requester.
 * It handles both successful and error responses, returning the appropriate data to the callback function.
 *
 * The adapter provides wrappers for GCP Functions, AWS Lambda, and newer AWS Lambda implementations.
 * It also exposes the createRequest function for testing and running in Express applications.
 *
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
  city: ['q', 'city', 'town'],
  endpoint: false
}

// Define request to the API. 
// The Validator helps you validate the Chainlink request data
const createRequest = (input, callback) => {
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || 'weather'
  const url = `https://api.openweathermap.org/data/2.5/${endpoint}`
  const q = validator.validated.data.city.toUpperCase()
  const appid = process.env.API_KEY;
  console.log(appid);

  const params = {
    q,
    appid
  }

  const config = {
    url,
    params
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  // It's common practice to store the desired value at the top-level
  // result key. This allows different adapters to be compatible with
  // one another.
  Requester.request(config, customError)
    .then(response => {
      response.data.result = Requester.validateResultNumber(response.data, ['main','temp'])
      callback(response.status, Requester.success(jobRunID, response))
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
