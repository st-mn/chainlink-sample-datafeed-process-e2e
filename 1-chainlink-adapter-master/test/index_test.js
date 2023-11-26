/**
 * Test suite for the createRequest function.
 *
 * @description This test suite covers both successful and error scenarios for the createRequest function.
 * It verifies the function's behavior for different input parameters and validates the response data.
 *
 * The successful calls section tests the function's ability to handle various city names provided through different parameters.
 * It asserts that the status code is 200, the jobRunID is correct, the data object is not empty, and the result and data.result values are above zero.
 *
 * The error calls section tests the function's handling of invalid input data, such as empty body, empty data object.
 * It asserts that the status code is 500, the jobRunID is correct, the status is 'errored', and the error object is not empty.
 */


const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { base: 'ETH', quote: 'USD' } } },
      { name: 'base/quote', testData: { id: jobID, data: { base: 'ETH', quote: 'USD' } } },
      { name: 'from/to', testData: { id: jobID, data: { from: 'ETH', to: 'USD' } } },
      { name: 'coin/market', testData: { id: jobID, data: { coin: 'ETH', market: 'USD' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'base not supplied', testData: { id: jobID, data: { quote: 'USD' } } },
      { name: 'quote not supplied', testData: { id: jobID, data: { base: 'ETH' } } },
      { name: 'unknown base', testData: { id: jobID, data: { base: 'not_real', quote: 'USD' } } },
      { name: 'unknown quote', testData: { id: jobID, data: { base: 'ETH', quote: 'not_real' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
