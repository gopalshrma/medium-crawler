const url_model = require('../models/url');
const config = require('../config/config');

const addUrlsToDatabase = async (data) => {
    try {
        let insert_bool = true;
        // If we do not need to infinite crawl then check for current count of documents.
        // We can use the estimatedDocumentCount function here if necessary since it allows for
        // a constant time fetch of the count, but countDocuments is a lot more accurate.
        if(config.MAX_URLS !== -1) {
            let count = await url_model.countDocuments({});
            insert_bool = count < config.MAX_URLS;
        }

        /* Important Note : Due to the bundling of URLs being dumped into the database we cannot accurately stop
        at the exact count of the MAX_URLS constant and will probably usually exceed it slightly.*/
        if(insert_bool) {
            let url = await url_model.create(data);
            return url;
        } else {
            console.log(config.MAX_URLS + ' urls reached. Exiting.')
            process.exit();
        }
    } catch (error) {
        if(error && error.code === 11000)
            console.log('Duplicate key found.');
        else
            throw error;
    }
}

const increaseUrlCountAndMergeParams = async (data) => {
    try {
        // Unlike the previous function we cannot bundle and run this since the params for each url are different.
        // If we decide to ignore params we can bundle this into a single query.
        for(let link of data) {
            await url_model.findOneAndUpdate({url: link.url}, {
                $inc: {count: 1},
                $addToSet: {params: link.params}
            });
        }
        return;
    } catch (error) {
        throw error;
    }
}

const filterUrlsAndSaveToDb = async (urls) => {
    try {
        let to_be_added = [], to_be_incremented = [];
        // Create two arrays, one which is to be added to the DB
        // The other will need it's count updated and params merged with an existing document.
        if(urls && Array.isArray(urls)) {
            for(let url of urls) {
                let item = await url_model.findOne({url: url.url});
                if(item)
                    to_be_incremented.push(url);
                else
                    to_be_added.push(url);
            }
        } else {
            console.log(urls);
        }
        await addUrlsToDatabase(to_be_added);
        await increaseUrlCountAndMergeParams(to_be_incremented);
    } catch (error) {
        throw error;
    }
}

const getUrlStatus = async (url) => {
    try {
        let item = await url_model.findOne({url: url}).lean().select({scraped: 1});
        return item;
    } catch (error) {
        throw error;
    }
}

const setUrlToScraped = async (url) => {
    try {
        await url_model.findOneAndUpdate({url: url}, {$set: {scraped: true}});
        return;
    } catch (error) {
        throw error;
    }
}

const clearDatabaseForReRun = async () => {
    try {
        // Clear the entire collection during every rerun.
        await url_model.deleteMany({});
        return;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    filterUrlsAndSaveToDb,
    addUrlsToDatabase,
    increaseUrlCountAndMergeParams,
    clearDatabaseForReRun,
    setUrlToScraped,
    getUrlStatus
};