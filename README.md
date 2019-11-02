# Medium Crawler
Recursively crawls popular blogging website `https://medium.com` and harvests all possible hyperlinks that belong to medium.com and stores them in MongoDB.

## Pre-requisites
- Node.js
- npm
- MongoDB

## Setup
- Clone this repository with `git clone https://github.com/gopal131072/medium-crawler`.
- Move into the directory the program is in with `cd medium-crawler`
- Install node modules with `npm install`.
- Initiate the required environment variables. This can be done in two ways.
	- Dump a environment.env file into the root directory of the repository with all environment variables you need. 
	This will be auto included in the project.
	- Simply export the variables in any other way (source a bash file/add it to your .bashrc/add them one by one in the terminal etc.)
- Required env variables are as follows :

| Variable  |  Purpose |  Default  |
|------|------|------------|
| STARTING_URL| The URL from which the recursive crawling will start. | `https://medium.com/topic/popular` |
| BASE_URL | The hostname of the site, this'll be appended to things like relative URLs and the like. | `medium.com` |
| DB_CONNECTION | The URI for the mongodb instance, including protocol and authentication. | `mongodb://localhost:27017/rentomojo` |
| MAX_CONCURRENT_REQUESTS| The number of requests you want running concurrently at any given time. | 5 |
| MAX_URLS| Number of URLs after which the crawler will stop. -1 if you want it to run infinitely. | -1 |

- Start the mongod service/server depending on how you have it configured.

## Running the program
- The program can be run with `npm start`.
- If the MAX_URLS environment variable is set to -1 then the crawler will run infinitely 
(or until your heap space runs out atleast) and will need to be stopped manually.
- If MAX_CONCURRENT_REQUESTS is too high then you'll get blocked by the IP banner and start receiving 429 responses. I'd advise keeping this to 5 or lower.
