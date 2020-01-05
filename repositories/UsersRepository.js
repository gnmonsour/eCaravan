const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

require('dotenv').config();
const kDLIMITER = process.env.HASH_DELIMITER;
const Repository = require('./Repository.js');

class UsersRepository extends Repository {
	constructor(filename) {
		super(filename);

		if (!UsersRepository.singleton) {
			UsersRepository.singleton = this;
		}
		return UsersRepository.singleton;
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
}

const instance = new UsersRepository(process.env.DATASTORE_LOC + process.env.REPO_USERS_FILE);
Object.freeze(instance);

module.exports = instance;