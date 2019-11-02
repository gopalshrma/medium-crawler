// Internal Libraries
const Batch = require('./batch');
const Crawler = require('../utils/crawler');
const urlDbOperations = require('../utils/urlDbOperations');

// Configuration
const config = require('../config/config');
const request_batch = new Batch();

const startCrawler = async () => {
    try {
        // Initally clears the database in order to set up for the new run.
        await urlDbOperations.clearDatabaseForReRun();

        // Adds the starting URL to database.
        await urlDbOperations.addUrlsToDatabase({
            url: config.STARTING_URL,
            params: []
        });

        // Crawls the starting URL, but doesn't recursively run it, since we need multiple crawlers running simultaneously.
        await crawlLink(config.STARTING_URL);

        // Starts up parallel crawlers that all 
        for(let index = 0; index < config.MAX_CONCURRENT_REQUESTS; index++) {
            let item = await getNextLink();
            crawlLink(item, true);
        }
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

const crawlLink = async (link, recurse=false) => {
    try {
        // Fetches the URLs within the link.
        // Saves them to the DB.
        // Adds them to the batch.
        // Marks current URL as scraped.
        let items = await Crawler(link, config.BASE_URL);
        if(items && Array.isArray(items)) {
            await urlDbOperations.filterUrlsAndSaveToDb(items);
            request_batch.addArrayToBatch(items.map(elem => elem.url));
            await urlDbOperations.setUrlToScraped(link);
        }
        if(recurse) {
            // Fetch next URL to scrape.
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
    // Fetches the next item in the batch.
    // If the item in the batch has already been scraped then continues fetching items until it fetches a new one.
    // Batch items are unique but it is possible for removed URLs to be added again if they appear in later links.
    // Hence we need to maintain a DB level check for whether a URL has been scraped before or not.
    try {
        let link = request_batch.getNextItem();
        if(!link) {
            console.log('Batcher is empty.')
            process.exit();
        }
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