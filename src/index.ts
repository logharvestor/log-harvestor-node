
/* EXT */
import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from 'uuid';
import qs from 'qs'
/* INT */
import { API_URL } from './config'

enum ConfigValidtionError {
  NO_TOKEN = 'No Token',
  INVALID_TOKEN = 'Invalid Token',
  NO_APIURL = 'No ApiUrl',
  INVALID_APIURL = 'Invalid ApiUrl'
}

interface Response {
  status?: number
  statusText?: string
  data?: object
  unparsed?: AxiosResponse
}

interface ConfigValidationResult {
  valid: boolean
  errors: ConfigValidtionError[]
}

interface Log {
  type: string
  msg?: string | object | number | undefined | null | unknown
}

interface ForwarderConfig {
  token?: string
  apiUrl?: string
  verbose?: boolean
  batch?: boolean
  interval?: number
}

class Forwarder implements ForwarderConfig {
  /* INTERNAL */
  id: string  //uuid
  bucket: { id: number, log: Log }[]
  /* CONFIG */
  token: string
  apiUrl: string
  verbose?: boolean
  batch?: boolean
  interval: number
  /* STATS */
  totalLogs: number
  totalLogsSent: number
  totalBatches: number

  constructor({ token, apiUrl, verbose, batch, interval }: ForwarderConfig) {
    /* INTERNAL */
    this.id = uuidv4()
    this.bucket = []
    /* CONFIG */
    this.token = token || ''
    this.apiUrl = apiUrl || API_URL
    this.verbose = verbose || false
    this.batch = batch || false
    this.interval = interval || 20
    /* STATS */
    this.totalLogs = 0
    this.totalLogsSent = 0
    this.totalBatches = 0
    /* BATCHING */
    this.initBatching()
  }
  

  log = async ({ type, msg }: Log): Promise<Response> => {
    ++this.totalLogs
    if (this.batch) {
      // Add Log to bucket
      this.bucket.push({ id: this.totalLogs, log: { type, msg } })
      // Build Response
      const response = {
        status: 200,
        statusText: `Log #${this.totalLogs} added to batch`,
        data: {
          batchNumber: this.totalBatches + 1
        }
      }
      // Log Response if Verbose
      this.verbose && console.log(response)
      return response
    } else {
      // Send Log
      try {
        const res = await this.sendLog({ type, msg })
        // Build Response
        const { status, statusText, data } = res
        const response = { status, statusText, data, unparsed: res }
        // Log Response if Verbose
        this.verbose && console.log({ status, statusText, data })
        this.totalLogsSent++
        return response
      } catch (e) {
        return this.handleError(e)
      }
    }
  }

  testConn = async (): Promise<Response> => {
    try {
      const res = await this.checkConn()
      const { status, statusText, data } = res
      const response = { status, statusText, data, unparsed: res }
      this.verbose && console.log(status, statusText, data)
      return response
    } catch (e) {
      return this.handleError(e)
    }
  }

  private initBatching = () => {
    /* INITIALIZE BATCH */
    if (this.batch) {
      setInterval(async () => {
        // Check if bucket is empty
        if (this.bucket.length > 0) {
          // Send Bucket
          try {
            // Transfer bucketed logs
            const bucktedLogs: Log[] = []
            while (this.bucket.length) {
              bucktedLogs.push(this.bucket[0].log)
              this.bucket.splice(0, 1)
            }
            const res = await this.sendBatch(bucktedLogs)
            // Build Response
            const { status, statusText, data } = res
            // const response = { status, statusText, data, unparsed: res }
            // Log Response if Verbose
            this.verbose && console.log(status, statusText, data)
            // Clear Bucket
            this.totalLogsSent += this.bucket.length
            this.totalBatches++
            // Log Stats
            this.verbose && console.log({
              batch: this.totalBatches,
              totalBatches: this.totalBatches,
              logsInBatch: this.bucket.length,
              totalLogsSent: this.totalLogsSent,
              totalLogs: this.totalLogs,
            })
          } catch (e) {
            return this.handleError(e)
          }
        }
      }, this.interval * 1000)
    }
  }

  private sendLog = ({ type, msg }: Log) => axios({
    method: 'post',
    url: this.apiUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': `Bearer ${this.token}`
    },
    data: qs.stringify({ type, msg })
  })

  private sendBatch = (logs: Log[]) => {
    return axios({
      method: 'post',
      url: `${this.apiUrl}/batch`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': `Bearer ${this.token}`
      },
      data: qs.stringify({ logs })
    })
  }

  private checkConn = () => axios({
    method: 'post',
    url: `${this.apiUrl}/check`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': `Bearer ${this.token}`
    }
  })
  private handleError = (e: unknown) => {
    if (axios.isAxiosError(e)) {
      const errResponse = {
        status: e.response?.status || 400,
        statusText: e.response?.statusText || "Unknown error occured",
        data: e.response?.data,
        unparsed: e.response
      }
      this.verbose && console.log(errResponse)
      return errResponse
    } else {
      const errResponse = {
        status: 400,
        statusText: "Unknown error occured",
        data: { e }
      }
      this.verbose && console.log(errResponse)
      return errResponse
    }
  }

  static validateConfig = (config: ForwarderConfig): ConfigValidationResult => {
    const result: ConfigValidationResult = { valid: false, errors: [] }
    const pushErr = (err: ConfigValidtionError) => result.errors.push(err)

    /* RegEx Validators */
    const REGEX_TOKEN = new RegExp("^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*$")
    const REGEX_APIURL = new RegExp("(?:https?)://(\\w+:?\\w*)?(\\S+)(:\\d+)?(/|/([\\w#!:.?+=&%!-/]))?");
    /* TOKEN */
    !config.token && (pushErr(ConfigValidtionError.NO_TOKEN))
    config.token && !REGEX_TOKEN.test(config.token) && (pushErr(ConfigValidtionError.INVALID_TOKEN))
    /* API URL */
    config.apiUrl === "" && (pushErr(ConfigValidtionError.NO_APIURL))
    config.apiUrl && !REGEX_APIURL.test(config.apiUrl) && (pushErr(ConfigValidtionError.INVALID_APIURL))

    // If no errors, set valid -> true
    result.errors.length === 0 && (result.valid = true)
    return result
  }
}

export { Response, ConfigValidationResult, ConfigValidtionError, Log, ForwarderConfig, Forwarder }
