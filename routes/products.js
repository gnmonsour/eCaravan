const express = require('express');
const productsRepo = require('../repositories/ProductsRepository');
const cartsRepo = require('../repositories/CartsRepository');
const publicProductsTemplate = require('../views/products/index');
// customer facing router
const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    let count = 0;
    if(req.session.cartId){
     count = await cartsRepo.getItemCount(req.session.cartId);
    }
	return	res.send(publicProductsTemplate({products, count}));
});



module.exports = router;