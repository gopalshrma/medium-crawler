// External Libraries
const path = require('path');
const dotenv = require('dotenv').config;
dotenv({path: path.join(__dirname, 'environment.env')});

// Internal Libraries
const requestBatcher = require('./batcher/requestBatcher');

requestBatcher.startCrawler();