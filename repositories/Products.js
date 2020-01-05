const Repository = require('./Repository');

class ProductsRepository extends Repository {
	constructor(filename) {
		super(filename);

		if (!ProductsRepository.singleton) {
			ProductsRepository.singleton = this;
		}
		return ProductsRepository.singleton;
	}

}



const instance = new ProductsRepository(process.env.DATASTORE_LOC + process.env.REPO_PRODUCTS_FILE);
Object.freeze(instance);

module.exports = instance;