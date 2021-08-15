# log-harvestor-node

## Documentation
See [API Docs](https://www.logharvestor.com/#/docs/api) for Log-Harvestor.

This package is specific to node. Please see our docs for other supported languages, or use standard HTTP requests.

## Installation
______________

```console
npm install log-harvestor-node
```

or 

```console
yarn add log-harvestor-node
```

## Usage
_____________
This package requires that you have a **Log Harvestor** account, and *Forwarder's* created.
If you have not done this yet:
1. Go to [LogHarvestor.com](https://www.logharvestor.com)
2. Register for a new Account (This is free)  
3. Create a new Forwarder - [Link](https://www.logharvestor.com/#/v1/forwarder)
4. Generate a Forwarder Token

Now you can use this forwarder token to send logs, by adding it to the config:
```JavaScript
const LogHarvestor = require('log-harvestor-node');

const FWDR_TOKEN = 'your_forwarder_token'

LogHarvestor.configure(FWDR_TOKEN)

LogHarvestor.log('test', {title: 'Hello World'})

```
## Configuration
___________

| Option            | Default       | Description                              |
| :---              | :----:        | :---                                     |
| **BATCH**         | false         | Batch mode sends logs in batches         |
| **INTERVAL**      | 10            | Time between batches in seconds          |
| **VERBOSE**       | false         | Verbose mode prints info to the console  |


## Methods
- ### **Configure**
    - Params
        - TOKEN: **STRING**
        - OPTIONS: **OBJECT** (*See Configuration Section*)
    - Returns **BOOLEAN**
    - Example:
        - All Args
            ```Javascript
                const LogHarvestor = require('log-harvestor-node');
                const FWDR_TOKEN = 'your_forwarder_token'
                LogHarvestor.configure(FWDR_TOKEN, {
                    BATCH: true,
                    INTERVAL: 30,
                    VERBOSE: true
                })
            ```
        - Default Args
            ```JavaScript
                const LogHarvestor = require('log-harvestor-node');
                const FWDR_TOKEN = 'your_forwarder_token'
                LogHarvestor.configure(FWDR_TOKEN)
            ```
- ### **Log**
    - Params
        - TYPE: **STRING**
        - MSG: **ANY**
    - Returns: **VOID**
    - Example:
        - Log String
            ```Javascript
                LogHarvestor.log('Simple String', 'Wow! This is easy')
            ```
        - Log Object
            ```Javascript
                LogHarvestor.log('Simple Object', {title: 'Hello World'})
                LogHarvestor.log('Null Object', {title: 'Hello World'})
                LogHarvestor.log('Big Object', {
                    title: 'Hello World',
                    description: 'Logging is easy now',
                    metadata: {
                        t: Date.now()
                        traceId: '123ABC'
                    },
                    comment: 'You can put anything you want!'
                })
            ```

## Recomendations
________________
1. Keep your Loggin specific, and consise. This makes searching faster and more accurate
2. No need to add timestamps or info about the forwarder. This information is automatically included with the log.