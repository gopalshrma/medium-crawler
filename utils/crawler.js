// External Libraries
const axios = require('axios');
const cheerio = require('cheerio');
const parseQueryParams = require('query-string');

const parseUrlParams = (url) => {
    // Splits the url by '?' to obtain host with path and query params separately
    let items = url.split('?');

    // Parses params if there are any using query-string
    let params = items && Array.isArray(items) && items[1] 
    ? 
    Object.keys(parseQueryParams.parse(items[1]))
    :
    [];

    // Returns parsed URL and params
    return {url: items[0], params};
};

const getHyperlinksFromBody = (body, base_url) => {
    // Initializes selector with the html body.
    const selector = cheerio.load(body), hyperlinks = [];

    // Fetches all the a tags in the page.
    let links = selector('a')

    // If there are no a tags return.
    if(!links)
        return [];

    // For each a tag, fetch the URL it is pointing to and add it into hyperlinks.
    selector(links).each((i, each) => {
        let href = selector(each).attr('href');

        // Parse query params if there are any
        let {url, params} = parseUrlParams(href ? href : '');

        // If the URL is a protocol relative URI, or requires authentication then ignore it entirely.
        if(url.startsWith('//') || url.endsWith('/me') || url.includes('/me/')) {
            return [];
        }

        // If the URL is a relative URL pointing to the same domain the add the base url at the start.
        url = url.startsWith('/') ? `https://${base_url}${url}` : url;

        // This allows us to ignore links without http/https protocols and any external URLs
        // For example mailto links with the author's mail address
        // Or an ftp server link
        let has_right_protocol = url.startsWith('https://') || url.startsWith('http://');
        if(!url.includes(base_url) || !has_right_protocol) {
            return [];
        }

        // If the URL already exists then merge the query params of the two. 
        // Else add it to list of URLs/
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
        // Fetch the URL response and get all hyperlinks within it, then return.
        console.log('Crawling page -', link);
        const response = await axios.get(link);
        return getHyperlinksFromBody(response.data, base_url);
    } catch (error) {
        if(error && error.response && error.response.status) {
            console.log(error.response.status, link);
            return [];
        }
        else
            throw error;
    }
};

module.exports = requestUrlAndGetHyperlinks;