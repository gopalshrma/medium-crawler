// External Libraries
const path = require('path');
const dotenv = require('dotenv').config;

// Configuration
const requestBatcher = require('./batcher/batchRequests');
dotenv({path: path.join(__dirname, 'environment.env')});

(async () => {
    try {
        requestBatcher.startCrawler();
    } catch (error) {
        console.log(error);
    }
})();