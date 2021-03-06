const Repository = require('./Repository');

class CartsRepository extends Repository {
	constructor(filename) {
		super(filename);

		if (!CartsRepository.singleton) {
			CartsRepository.singleton = this;
		}
		return CartsRepository.singleton;
	}
	async create(attrs) {
		attrs.id = this.createRandomId();
		const carts = await this.getAll();
		carts.push(attrs);
		this.writeAll(carts);
		return attrs.id;
	}

	async getItemCount(cartId) {
		const cart = await this.getOne(cartId);
		console.log(cart);
		return cart.items.length;
	}
}



const instance = new CartsRepository(process.env.DATASTORE_LOC + process.env.REPO_CARTS_FILE);
Object.freeze(instance);

module.exports = instance;