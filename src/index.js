/* IMPORTS */
const axios = require('axios')
const qs = require('qs')

/* CONSTANTS */
const API_URL = 'https://www.logharvestor.com/api/log'

/* DEFAULTS */
let BATCH = false
let INTERVAL = 10
let VERBOSE = false


const parseError = (err) => {
    return ({
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data
    })
} 

class LogHarvestor {
    constructor(FWDR_TOKEN, OPTIONS){
        this.API_URL = API_URL
        this.BATCH = OPTIONS?.BATCH || BATCH
        this.INTERVAL = OPTIONS?.INTERVAL || INTERVAL
        this.VERBOSE = OPTIONS?.VERBOSE || VERBOSE
        this.FWDR_TOKEN = FWDR_TOKEN || null 
    }

    log = (type, msg) => {
        axios({
            method: 'post',
            url: this.API_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${this.FWDR_TOKEN}`
            },
            data: qs.stringify({type, msg})
        })
            .then(result => {if(this.VERBOSE){console.log(result.data)}})
            .catch(err => {if(this.VERBOSE){console.log(parseError(err))}})
    }
}

let LH = new LogHarvestor()

const configure = (FWDR_TOKEN, OPTIONS) => LH = new LogHarvestor(FWDR_TOKEN, OPTIONS)

const log = (type, msg) => LH.log(type, msg)

module.exports = {configure, log}