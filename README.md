<p align="center"><a href="https://www.logharvestor.com" target="_blank" rel="noopener" referrerpolicy='origin'><img width="70%" src="https://i.ibb.co/WtHJgnz/logo-wht.png" alt="LogHarvestor Logo"></a></p>


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
                LogHarvestor.log('Null Object', {})
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
1. Keep your Logging specific, and consise. This makes searching faster and more accurate
2. No need to add timestamps or info about the forwarder. This information is automatically included with the log.



<p align="center"><a href="https://www.logharvestor.com" target="_blank" rel="noopener" referrerpolicy='origin'><img width="100" src="https://i.ibb.co/80sThNP/icon-drk.png" alt="LogHarvestor Logo"></a></p>
