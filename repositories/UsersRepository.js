const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

require('dotenv').config();
const kDLIMITER = process.env.HASH_DELIMITER;

class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('A filename is needed to create this repository.');
		}

		if (!UsersRepository.singleton) {
			this.filename = filename;

			try {
				fs.accessSync(filename);
			} catch (err) {
				fs.writeFileSync(this.filename, '[]');
				console.log('file created');
			}
			UsersRepository.singleton = this;
		}
		return UsersRepository.singleton;
	}

	async getAll() {
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}

	async create(attrs) {
		attrs.id = this.createRandomId();
		const salt = this.createRandomSalt();
		const bufr = await scrypt(attrs.password, salt, 64);
		const users = await this.getAll();
		const bufferedAttr = { ...attrs, password: `${bufr.toString('hex')}${kDLIMITER}${salt}` };
		users.push(bufferedAttr);
		this.writeAll(users);
		return bufferedAttr;
	}

	async validatedPassword(supplied, saved) {
		const [ compareWith, savedsalt ] = saved.split(kDLIMITER);
		return compareWith === (await scrypt(supplied, savedsalt, 64)).toString('hex');
	}

	async writeAll(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), { encoding: 'utf8' });
	}

	createRandomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	createRandomSalt() {
		return crypto.randomBytes(8).toString('hex');
	}

	async getOne(id) {
		const users = await this.getAll();
		return users.find((user) => user.id === id);
	}

	async delete(id) {
		const users = await this.getAll();
		const updatedUsers = users.filter((user) => user.id !== id);
		await this.writeAll(updatedUsers);
	}

	async update(id, attrs) {
		const users = await this.getAll();
		const user = users.find((user) => user.id === id);
		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}
		Object.assign(user, attrs);
		await this.writeAll(users);
	}

	async getFirst(filters) {
		const users = await this.getAll();
		const keys = Object.keys(filters);
		for (let user of users) {
			let isFound = true;
			for (let key of keys) {
				if (user[key] !== filters[key]) {
					isFound = false;
					break; // break out of the inner loop
				}
			}
			if (isFound) return user;
		}
		return undefined;
	}
}

const instance = new UsersRepository(process.env.DATASTORE_LOC + process.env.REPO_USERS_FILE);
Object.freeze(instance);

module.exports = instance;