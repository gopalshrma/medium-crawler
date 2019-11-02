// Internal Libraries
const Batch = require('./batch');
const Scraper = require('../utils/scraper');
const addToDb = require('../utils/urlDbOperations');

// Configuration
const config = require('../config/config');
const request_batch = new Batch();

const startCrawler = async () => {
    try {
        await addToDb.clearDatabaseForReRun();
        await addToDb.addUrlsToDatabase({
            url: config.STARTING_URL,
            params: []
        });
        await crawlLink(config.STARTING_URL);
        for(let index = 0; index < config.MAX_CONCURRENT_REQUESTS; index++) {
            let item = getNextLink();
            crawlLink(item, true);
        }
    } catch (error) {
        throw error;
    }
}

const crawlLink = async (link, recurse=false) => {
    try {
        let items = await Scraper(link, config.BASE_URL);
        await addToDb.filterUrlsAndSaveToDb(items);
        await addToDb.setUrlToScraped(link);
        request_batch.addArrayToBatch(items.map(elem => elem.url));
        if(recurse) {
            crawlLink(getNextLink(), true);
        } else {
            return;
        }
    } catch (error) {
        throw error;
    }
}

const getNextLink = () => {
    let link = request_batch.getNextItem();
    let status = addToDb.getUrlStatus(link);
    if(status) {
        return link;
    } else {
        return getNextLink();
    }
}

module.exports = {
    startCrawler
};