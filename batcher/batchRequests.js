// Internal Libraries
const Batch = require('./batch');
const Scraper = require('../utils/crawler');
const urlDbOperations = require('../utils/urlDbOperations');

// Configuration
const config = require('../config/config');
const request_batch = new Batch();

const startCrawler = async () => {
    try {
        await urlDbOperations.clearDatabaseForReRun();
        await urlDbOperations.addUrlsToDatabase({
            url: config.STARTING_URL,
            params: []
        });
        await crawlLink(config.STARTING_URL);
        for(let index = 0; index < config.MAX_CONCURRENT_REQUESTS; index++) {
            let item = await getNextLink();
            if(!item) {
                throw new Error(`Initial page does not have ${config.MAX_CONCURRENT_REQUESTS} links. Please tone down MAX_CONCURRENT_REQUESTS if this becomes an issue going forth.`);
            }
            crawlLink(item, true);
        }
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

const crawlLink = async (link, recurse=false) => {
    try {
        let items = await Scraper(link, config.BASE_URL);
        if(items && Array.isArray(items)) {
            await urlDbOperations.filterUrlsAndSaveToDb(items);
            request_batch.addArrayToBatch(items.map(elem => elem.url));
            await urlDbOperations.setUrlToScraped(link);
        }
        if(recurse) {
            let nextLink = await getNextLink();
            return nextLink ? crawlLink(nextLink, true) : null;
        } else {
            return;
        }
    } catch (error) {
        console.log(error);
    }
}

const getNextLink = async () => {
    try {
        let link = request_batch.getNextItem();
        let url = await urlDbOperations.getUrlStatus(link);
        if(url && !url.scraped) {
            return link;
        } else {
            return getNextLink();
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    startCrawler
};