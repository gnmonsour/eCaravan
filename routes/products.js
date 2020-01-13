const express = require('express');
const productsRepo = require('../repositories/ProductsRepository');
const publicProductsTemplate = require('../views/products/index');
// customer facing router
const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
	return	res.send(publicProductsTemplate({products, count: 0}));
});



module.exports = router;