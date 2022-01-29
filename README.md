<p align="center"><a href="https://www.logharvestor.com" target="_blank" rel="noopener" referrerpolicy='origin'><img width="70%" src="https://i.ibb.co/gwFL3jk/logo-drk.png" alt="LogHarvestor Logo"></a></p>


<p align="center">
  <a href="https://www.linkedin.com/company/log-harvestor" rel="nofollow">
    <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Log Harvestor - LinkedIn"> 
  </a> &nbsp; 
  <a href="https://twitter.com/LogHarvestor" rel="nofollow">
    <img src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white" alt="LogHarvestor - Twitter">
  </a> &nbsp; 
  <a href="https://www.youtube.com/channel/UCS9BdZPla9UbUQ3AZJEzVvw" rel="nofollow">
    <img src="https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white" alt="Log Harvestor - You Tube">
  </a>
</p>

# log-harvestor-node

[![Rate on Openbase](https://badges.openbase.com/js/rating/log-harvestor-node.svg)](https://openbase.com/js/log-harvestor-node?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)


## Documentation
See [API Docs](https://www.logharvestor.com/docs/api) for Log-Harvestor.

This package is specific to `NodeJS`. Please see our docs for other supported languages, or use standard HTTP requests.

## Installation
______________

```console
npm install log-harvestor-node
```

or 

```console
yarn add log-harvestor-node
```

## Getting Started
_____________
This package requires that you have a **Log Harvestor** account, and *Forwarder's* created.
If you have not done this yet:
1. Go to [LogHarvestor.com](https://www.logharvestor.com)
2. Register for a new Account (This is free) [Register](https://app.logharvestor.com/register)  
3. Create a new Forwarder - [Link](https://app.logharvestor.com/forwarder)
4. Generate a Forwarder Token

Now you can use this forwarder token to send logs, by adding it to a new `Forwarder`.
```JavaScript
const { Forwarder } = require('log-harvestor-node');

const FWDR_TOKEN = 'your_forwarder_token'

const fwdr = new Forwarder({token: FWDR_TOKEN})
fwdr.log({ type: 'test', msg: { title: 'Hello World' } })
```
## Configuration
___________

| Option            | Default       | Description                              |
| :---              | :----:        | :---                                     |
| **BATCH**         | false         | Batch mode sends logs in batches         |
| **INTERVAL**      | 10            | Time between batches in seconds          |
| **VERBOSE**       | false         | Verbose mode prints info to the console  |


## Sending Logs
___________

```JavaScript
const { Forwarder } = require('log-harvestor-node');
const FWDR_TOKEN = 'your_forwarder_token'
const fwdr = new Forwarder({token: FWDR_TOKEN})

/* Log Types 
    - The log type is a string
    - This is the primary way logs are categorized & indexed
*/
fwdr.log({ type: 'any',     msg: 'message' })
fwdr.log({ type: 'thing',   msg: 'message' })
fwdr.log({ type: 'works',   msg: 'message' })

/* Log Messages 
    - Any valid type that you want
*/

// Numbers
fwdr.log({ type: 'test',    msg: 123456789 })
fwdr.log({ type: 'test',    msg: 0.000212  })
// Strings
fwdr.log({ type: 'test',    msg: 'What is my purpose?' })
fwdr.log({ type: 'test',    msg: 'You forward logs...' })
fwdr.log({ type: 'test',    msg: '-o_O-' })
// Arrays
fwdr.log({ type: 'test',    msg: [1,2,'3'] })
fwdr.log({ type: 'test',    msg: ['I', { logs: '<3' }, '!' ] })
// Objects
fwdr.log({ 
    type: 'test',    
    msg: { 
        title: 'Hello World', 
        desc: { 
            so: 'long', 
            and: 'thanks for all the fish!' 
        },
        trace: '42' 
    } 
})
```
## Handling Errors
___________

```JavaScript
/* ASYNC */
const example = async () => {
    try{
        await res = fwdr.log({type: 'hello', msg: 'world'})
    }catch(e){
        // Handle Error Logic
    }
}

/* Then/Catch */
fwdr.log({type: 'hello', msg: 'world'})
    .then(() => {})
    .catch(() => {})
```

## Connection Test
___________
```JavaScript
const { Forwarder } = require('log-harvestor-node');
const BAD_TOKEN = 'invalid_token'

const fwdr = new Forwarder({token: BAD_TOKEN})

/* 
    testConn returns a promise. 
    You can handle it however you like.
*/
fwdr.testConn()
    .then(() => {})
    .catch(() => {})

```

## Config Validation
___________
```JavaScript
const { Forwarder } = require('log-harvestor-node');
const INVALID_TOKEN = 'invalid token'
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvcndhcmRlciJ9.eyJfaWQiOiI2MTI4OTIwYjNjMzQyNTAwMjFkZGQyMTciLCJpYXQiOjE2MzAwNDg3ODN9.sb8lfpp01CC-y0T9Z5XiIEdy-JBeDHSBD8Gd05bZYaQ'

/* Valid Tokens are JWTs */

const validTest = Forwarder.validateConfig({token: INVALID_TOKEN})
console.log(validTest)
/* 
    { valid: true, errors: [] }
*/

const invalidTest = Forwarder.validateConfig({token: VALID_TOKEN})
console.log(invalidTest)
/* 
    {
        valid: false,
        errors: [
            ConfigValidtionError.INVALID_TOKEN
        ]
    }
*/
```
## Multiple Forwarders
________
```Javascript
const { Forwarder } = require('log-harvestor-node');

const FWDR_TOKEN_ONE = 'your_forwarder_token_one'
const fwdrOne = new Forwarder({token: FWDR_TOKEN_ONE})
fwdrOne.log(...)


const FWDR_TOKEN_TWO = 'your_forwarder_token_two'
const fwdrTwo = new Forwarder({token: FWDR_TOKEN_TWO})
fwdrTwo.log(...)
```
## Same Forwarder - Multiple Configs
_________
```Javascript
const { Forwarder } = require('log-harvestor-node');

const FWDR_TOKEN = 'your_forwarder_token'

const fwdrMain = new Forwarder({token: FWDR_TOKEN})
const fwdrSecondary = new Forwarder({token: FWDR_TOKEN})

fwderMain.log({type: 'super', msg: 'flexible'})
fwderSecondary.log({type: 'json', msg: 'is awesome'})
```
## Batching
_________
This is one of the more complex functionalities of LogHarvestors SDK

Batch Mode, enables the forwarder to send logs on a polling-style interval

To enable `batch` just set `{ batch: true }` when creating the forwarder

Now whenever you create a new log, it will be added to the `bucket`

The forwarder will check it's `bucket` on an interval, and send all the logs within
the bucket in a single request - saving on bandwith.

To control the frequency of the batching, just set the interval `{ interval: {{ INTEGER }} }`

### *For example*: 
```Javascript
const { Forwarder } = require('log-harvestor-node');
const FWDR_TOKEN = 'your_forwarder_token'

const fwdr = new Forwarder({
    token: FWDR_TOKEN,
    batch: true,
    interval: 60 // 60 Second interval
})
```

To test this, try implementing the snippet bellow:

```Javascript
const { Forwarder } = require('log-harvestor-node');
const FWDR_TOKEN = 'your_forwarder_token'

const fwdr = new Forwarder({
    token: FWDR_TOKEN,
    batch: true,
    interval: 30 // Every 30 seconds, your forwarder will try to send a batch of logs
})

fwdr.log({type: 'savin', msg: 'bandwidth'})
fwdr.log({type: 'batch', msg: 'mode rocks!'})

console.log(fwdr.bucket)
/* 
[
    { id: 12341591234, log: { type: 'savin', msg: 'bandwidth' } },
    { id: 76841587912, log: { type: 'batch', msg: 'mode rocks!' } },
]
*/
setTimeout(() => {
    console.log(fwdr.bucket)
/* No more logs!
    []
*/
}, 32000) // 32 Seconds

```






## Recomendations
________________
1. Keep your Logging specific, and consise. This makes searching faster and more accurate
2. No need to add timestamps or info about the forwarder. This information is automatically included with the log.



<p align="center"><a href="https://www.logharvestor.com" target="_blank" rel="noopener" referrerpolicy='origin'><img width="100" src="https://i.ibb.co/80sThNP/icon-drk.png" alt="LogHarvestor Logo"></a></p>
