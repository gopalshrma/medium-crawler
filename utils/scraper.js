// External Libraries
const axios = require('axios');
const cheerio = require('cheerio');
const parseQueryParams = require('query-string');

const parseUrlParams = (url) => {
    let items = url.split('?');

    let params = items && Array.isArray(items) && items[1] 
    ? 
    Object.keys(parseQueryParams.parse(items[1]))
    :
    [];

    return {url: items[0], params};
};

const getHyperlinksFromBody = (body, base_url) => {
    const selector = cheerio.load(body), hyperlinks = [];
    let links = selector('a')
    if(!links)
        return [];
    selector(links).each((i, each) => {
        let href = selector(each).attr('href');
        let {url, params} = parseUrlParams(href ? href : '');
        url = url.startsWith('/') ? `https://${base_url}${url}` : url;
        if(!url.includes(base_url)) {
            return [];
        }
        let index = hyperlinks.findIndex(elem => elem.url === url);
        if(index === -1)
            hyperlinks.push({url, params});
        else
            hyperlinks[index].params = Array.from(new Set(hyperlinks[index].params.concat(params)));
    });
    return hyperlinks;
};

const requestUrlAndGetHyperlinks = async (link, base_url) => {
    try {
        console.log('Scraping page ', link);
        const response = await axios.get(link);
        return getHyperlinksFromBody(response.data, base_url);
    } catch (error) {
        if(error && error.response && error.response.status && error.response.status === 404) {
            console.log('Page not found! ', link);
            return [];
        }else {
            throw error;
        }
    }
};

module.exports = requestUrlAndGetHyperlinks;