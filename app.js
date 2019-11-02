// External Libraries
const path = require('path');
const dotenv = require('dotenv').config;

// Internal Libraries
const requestBatcher = require('./batcher/requestBatcher');

// Configuration
dotenv({path: path.join(__dirname, 'environment.env')});

requestBatcher.startCrawler();