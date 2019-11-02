module.exports = {
    STARTING_URL: process.env.STARTING_URL || 'https://medium.com/topic/popular', // The URL from which the recursive crawling will start.
    BASE_URL: process.env.BASE_URL || 'medium.com', // The hostname of the site, this'll be appended to things like relative URLs and the like.
    DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb://localhost:27017/rentomojo',
    MAX_CONCURRENT_REQUESTS: process.env.MAX_CONCURRENT_REQUESTS || 5, // The number of requests you want running concurrently at any given time.
    MAX_URLS: process.env.MAX_URLS || -1 // Number of URLs after which the crawler will stop. -1 if you want it to run infinitely.
}