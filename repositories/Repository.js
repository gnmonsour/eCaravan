const fs = require('fs');
const crypto = require('crypto');
// const util = require('util');
// const scrypt = util.promisify(crypto.scrypt);

require('dotenv').config();
// const kDLIMITER = process.env.HASH_DELIMITER;

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error('A filename is needed to create this repository.');
		}
		this.filename = filename;
	
    }
    
    async create(attrs) {
        attrs.id = this.createRandomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
    }
    
	createRandomSalt() {
		return crypto.randomBytes(8).toString('hex');
    }
    
	createRandomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getAll() {
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}

	async writeAll(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), { encoding: 'utf8' });
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const candidate = await this.getOne(id);
		const updatedRecords = records.filter((record) => record.id !== id);
		await this.writeAll(updatedRecords);
		return candidate;
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);
		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}
		Object.assign(record, attrs);
		await this.writeAll(records);
	}

	async getFirst(filters) {
		const records = await this.getAll();
		const keys = Object.keys(filters);
		for (let record of records) {
			let isFound = true;
			for (let key of keys) {
				if (record[key] !== filters[key]) {
					isFound = false;
					break; // break out of the inner loop
				}
			}
			if (isFound) return record;
		}
		return undefined;
	}

	createOrRecoverStore() {
		try {
			fs.accessSync(filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
			console.log('file created');
		}
	}
}


