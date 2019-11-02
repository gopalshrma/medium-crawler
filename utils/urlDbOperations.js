const url_model = require('../models/url');
const config = require('../config/config');

const addUrlsToDatabase = async (data) => {
    try {
        let insert_bool = true;
        if(config.MAX_URLS !== -1) {
            let count = await url_model.countDocuments({});
            insert_bool = count < config.MAX_URLS;
        }
        if(insert_bool) {
            let url = await url_model.create(data);
            return url;
        } else {
            console.log(config.MAX_URLS, 'reached. Exiting.')
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
        // We cannot bundle and run this since the params for each url are different.
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

const clearDatabaseForReRun = async (urls) => {
    try {
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