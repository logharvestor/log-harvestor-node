/* AVA */
import test from 'ava'
/* LOG HARVESTOR */
import { ConfigValidationResult, ConfigValidtionError, Forwarder, ForwarderConfig, Log, Response } from '.'
import { API_URL } from './config'

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvcndhcmRlciJ9.eyJfaWQiOiI2MTI4OTIwYjNjMzQyNTAwMjFkZGQyMTciLCJpYXQiOjE2MzAwNDg3ODN9.sb8lfpp01CC-y0T9Z5XiIEdy-JBeDHSBD8Gd05bZYaQ'
const validTokenLocal = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvcndhcmRlciJ9.eyJfaWQiOiI2MzFlZDM2ZjU4NjYyNDJkNmJkMjg1ZTEiLCJpYXQiOjE2NjI5NjQ1OTF9.yZQL_xJgnqNDYg-GEdLxkMEy9poKKx8IZdFoHwYhRJU'
const invalidToken = '123ABC'
const validApiUrl = API_URL
const validApiUrlLocal = 'http://0.0.0.0:4000/api/log'
const invalidApiUrl = "tcp://localhost:3001"

interface ConfigTest {
  name: string
  expected: ConfigValidationResult
  config: ForwarderConfig
}
interface ConnTest {
  name: string
  expected: Response
  config: ForwarderConfig
}
interface LogVariantTest {
  name: string
  expected: boolean
  log: Log
}

const defaultConfig: ForwarderConfig = {
  token: '',
  apiUrl: API_URL,
  verbose: false,
  batch: false,
  interval: 20,
}

const remoteTestConfig: ForwarderConfig = {
  token: validToken,
  apiUrl: validApiUrl,
  verbose: false,
  batch: false,
  interval: 5,
}

const localTestConfig: ForwarderConfig = {
  token: validTokenLocal,
  apiUrl: validApiUrlLocal,
  verbose: false,
  batch: false,
  interval: 2,
}

/* DEFAULT CONFIG TESTS */
test('Default Configs', t => {
  const fwdr = new Forwarder({})
  t.like(fwdr, defaultConfig)
})

/* CONFIG TESTS */
const configTests: ConfigTest[] = [
  { name: 'No token', expected: { valid: false, errors: [ConfigValidtionError.NO_TOKEN] }, config: {} },
  { name: 'No apiUrl', expected: { valid: false, errors: [ConfigValidtionError.NO_APIURL] }, config: { token: validToken, apiUrl: "" } },
  { name: 'Invalid token', expected: { valid: false, errors: [ConfigValidtionError.INVALID_TOKEN] }, config: { token: invalidToken } },
  { name: 'Invalid apiUrl ', expected: { valid: false, errors: [ConfigValidtionError.INVALID_APIURL] }, config: { token: validToken, apiUrl: invalidApiUrl } },
  { name: 'No token; Invalid apiUrl ', expected: { valid: false, errors: [ConfigValidtionError.NO_TOKEN, ConfigValidtionError.INVALID_APIURL] }, config: { token: "", apiUrl: invalidApiUrl } },
  { name: 'Invalid token; No apiUrl ', expected: { valid: false, errors: [ConfigValidtionError.INVALID_TOKEN, ConfigValidtionError.NO_APIURL] }, config: { token: invalidToken, apiUrl: "" } },
  { name: 'Invalid token; Invalid apiUrl ', expected: { valid: false, errors: [ConfigValidtionError.INVALID_TOKEN, ConfigValidtionError.INVALID_APIURL] }, config: { token: invalidToken, apiUrl: invalidApiUrl } },
  { name: 'Valid token', expected: { valid: true, errors: [] }, config: { token: validToken } },
  { name: 'Valid local apiUrl', expected: { valid: true, errors: [] }, config: { token: validToken, apiUrl: validApiUrlLocal } },
]
configTests.map((v, i) => {
  test(`ConfigTest #${++i}: ${v.name}`, t => {
    t.like(Forwarder.validateConfig(v.config), v.expected)
  })
})

/* CONNECTION TESTS */
const connTests: ConnTest[] = [
  { name: 'Local Test', expected: { status: 200, statusText: 'OK' }, config: localTestConfig },
  { name: 'Remote Test', expected: { status: 200, statusText: 'OK' }, config: remoteTestConfig },
  { name: 'Local Test - Invalid Token', expected: { status: 401, statusText: 'Unauthorized' }, config: { ...localTestConfig, token: validToken } },
  { name: 'Remote Test - Invalid Token', expected: { status: 401, statusText: 'Unauthorized' }, config: { ...remoteTestConfig, token: validTokenLocal } },
  { name: 'Remote Test - Invalid ApiUrl', expected: { status: 400, statusText: 'Unknown error occured' }, config: { ...remoteTestConfig, apiUrl: 'https://asdf.logharvestor.com' } },
]

connTests.map((v, i) => {
  test(`ConnTest #${++i}: ${v.name}`, async t => {
    const fwdr = new Forwarder(v.config)
    const res = await fwdr.testConn()
    t.like(res, v.expected)
  })
})


/* LOG VARIANT TESTS */
const logVariantTests: LogVariantTest[] = [
  { name: "Single String", expected: true, log: { type: "test", msg: "hello world!" } },
  { name: "Single Number", expected: true, log: { type: "test", msg: 123 } },
  { name: "Single Object", expected: true, log: { type: "test", msg: { a: 123, b: "456", c: "hello" } } },
  { name: "Nested Object", expected: true, log: { type: "test", msg: { a: { b: "123" } } } },
  { name: "Nested Mixed", expected: true, log: { type: "test", msg: { a: 123, b: { c: "123", d: null } } } },
  { name: "String Array", expected: true, log: { type: "test", msg: ["hello", "mars", "goodbye", "world"] } },
  { name: "Number Array", expected: true, log: { type: "test", msg: [1, 2, 34, 567, 8, 90] } },
  { name: "Object Array", expected: true, log: { type: "test", msg: [{ question: "Hello?", answer: "World!" }, { question: "So long?", answer: "Thanks for all the fish!" }] } },
  { name: "Mixed Array", expected: true, log: { type: "test", msg: [123, "abc", [1, 2, 3], { question: "Hello?", answer: "World!" }, { question: "So long?", answer: "Thanks for all the fish!" }] } },
  { name: "Empty Msg", expected: true, log: { type: "test", msg: "" } },
  { name: "Null Msg", expected: true, log: { type: "test", msg: null } }, // This only works in JS; Null values fail with other SDKs/Clients
]


const localVariantTestForwarder: Forwarder = new Forwarder(localTestConfig)
const remoteVariantTestForwarder: Forwarder = new Forwarder(remoteTestConfig)
logVariantTests.map((v, i) => {
  test(`Local LogVariantTest #${++i}: ${v.name}`, async t => {
    const res = await localVariantTestForwarder.log(v.log)
    t.is(res.status === 200, v.expected)
  })
  test(`Remote LogVariantTest #${++i}: ${v.name}`, async t => {
    const res = await remoteVariantTestForwarder.log(v.log)
    t.is(res.status === 200, v.expected)
  })
})


/* LOG BATCH TESTS */
interface LogBatchTest {
  name: string
  duration: number
  genInterval: number
  batchInterval: number
}

const logBatchTests: LogBatchTest[] = [
  { name: 'Slow Batch', duration: 10000, genInterval: 200, batchInterval: 3 },
  { name: 'Fast Batch', duration: 5000, genInterval: 20, batchInterval: 1 }
]

const generateBatchLogs = (genInterval: number, duration: number, fwdr: Forwarder): Promise<number> => {
  let batchLogCount = 0
  let dur = 0
  return new Promise((resolve) => {
    const logGenInterval = setInterval(() => {
      fwdr.log({ type: 'test', msg: { test: 'BatchMode', desc: `Log #${batchLogCount}`} });
      ++batchLogCount
      dur += genInterval
      if (dur >= duration) {
        clearInterval(logGenInterval)
        resolve(batchLogCount)
      }
    }, genInterval)
  })
}

logBatchTests.map((v, i) => {
  test(`Local LogVariantTest #${++i}: ${v.name}`, async t => {
    const localLogBatchTestFwdr: Forwarder = new Forwarder({...localTestConfig, batch: true, verbose: false, interval: v.batchInterval})
    const y = await generateBatchLogs(v.genInterval, v.duration, localLogBatchTestFwdr)
    t.is(y, v.duration / v.genInterval, 'Batch Log Count')
    t.is(localLogBatchTestFwdr.totalLogs, y)
  })
  test(`Remote LogVariantTest #${++i}: ${v.name}`, async t => {
    const remoteLogBatchTestFwdr: Forwarder = new Forwarder({...remoteTestConfig, batch: true, verbose: false, interval: v.batchInterval})
    const y = await generateBatchLogs(v.genInterval, v.duration, remoteLogBatchTestFwdr)
    t.is(y, v.duration / v.genInterval, 'Batch Log Count')
    t.is(remoteLogBatchTestFwdr.totalLogs, y)
  })
})




