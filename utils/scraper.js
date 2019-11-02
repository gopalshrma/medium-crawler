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
    selector(selector('a')).each((i, each) => {
        let href = selector(each).attr('href');
        let {url, params} = parseUrlParams(href ? href : '');
        url = url.startsWith('/') ? `https://${base_url}${url}` : url;
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
        const response = await axios.get(link);
        return getHyperlinksFromBody(response.data, base_url);
    } catch (error) {
        throw error;
    }
};

module.exports = requestUrlAndGetHyperlinks;