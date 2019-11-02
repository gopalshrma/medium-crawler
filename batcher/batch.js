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