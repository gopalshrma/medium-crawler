// The Batch class is simply used to maintain the list of URLs we need to scrape.
// Since the instance of the batch class will exponentially grow, it is possible to run out of heap space because of this.
// The other option in this case would be to maintain a list within either a flat-file or a database that is constantly updated.
// Unless you plan on running this over a few million URLs I wouldn't worry about heap space though.
class Batch {

	constructor () {
		this.batch = [];
	}

	getBatch () {
		return this.batch;
	}

	getBatchSize () {
		return this.batch.length;
	}

	isEmpty () {
		return !this.batch.length;
	}

	addToBatch (item) {
		if(!this.batch.includes(item))
			this.batch.push(item);
	}

	addArrayToBatch (arr) {
		for(let item of arr) {
			this.addToBatch(item);
		}
	}

	getNextItem () {
		if(this.isEmpty())
			return null;
		else
			return this.batch.shift();
	}

}

module.exports = Batch;