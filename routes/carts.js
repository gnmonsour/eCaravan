const express = require('express');
const cartsRepo = require('../repositories/CartsRepository');
const productsRepo = require('../repositories/ProductsRepository');
// const currentCartTemplate = require('../views/carts/current');
// cartsRepo.createOrRecoverStore();

const router = express.Router();

const cartListing = require('../views/cart/show');

// can't get here when product inventory is zero
router.post('/cart/products', async (req, res) => {

    let cart;
   // set up cart to post to
    if(!req.session.cartId) {
        try {
            req.session.cartId = await cartsRepo.create({ items: [ ] });
        } catch (error) {
            if (error.code === 'ENOENT') {
				cartsRepo.createOrRecoverStore();
				req.session.cartId = await cartsRepo.create({items: [ ]});
            }
            // else return a 404 or 500 error response
        } 
    } 
    cart = await cartsRepo.getOne(req.session.cartId);
    
    const productId = req.body.productId;
    const items = cart.items;
    const product = await items.find((item) => item.productId === productId) || {};
    product.quantity = product.quantity ? product.quantity + 1 : 1;
    product.productId = productId;
    if(product.quantity <= 1){
        items.push(product);
    }
    await cartsRepo.update(cart.id, { items});

    res.send('Product added to cart');
});

// post delete item from cart


const getProductDetails = async (cart) => {
    const products = [];
    
    for(let item of cart.items) {
        const product = await productsRepo.getOne(item.productId);
        const total = product.price * item.quantity;
        products.push( {title: product.title, price: product.price, image: product.image, quantity: item.quantity, total, id: item.productId});
    }
    return products;
}
// show cart
router.get('/cart', async(req, res) => {
    if(!req.session.cartId) {
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);
    const products = await getProductDetails(cart);

    return res.send(cartListing({cart, products}));
} );


module.exports = router;