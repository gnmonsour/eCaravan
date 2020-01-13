const express = require('express');
const cartsRepo = require('../repositories/CartsRepository');
const productsRepo = require('../repositories/ProductsRepository');
// const currentCartTemplate = require('../views/carts/current');
// cartsRepo.createOrRecoverStore();

const router = express.Router();

const cartListing = require('../views/cart/show');
const publicProductsTemplate = require('../views/products/index');

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
    const updatedCart = await cartsRepo.update(cart.id, { items});
    const products = await productsRepo.getAll();
	return	res.send(publicProductsTemplate({products, count: updatedCart.items.length}))
});



const getProductDetails = async (cart) => {
    const products = [];
    let grandTotal = 0;
    
    for(let item of cart.items) {
        const product = await productsRepo.getOne(item.productId);
        const total = product.price * item.quantity;
        products.push( {title: product.title, price: product.price, image: product.image, quantity: item.quantity, total, id: item.productId});
        grandTotal+= total;
    }
    return {products, grandTotal};
}
// show cart
router.get('/cart', async(req, res) => {
    if(!req.session.cartId) {
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);
    const {products, grandTotal} = await getProductDetails(cart);
    
    return res.send(cartListing({cart, products, grandTotal}));
} );

// post delete item from cart
router.post('/cart/products/remove', async (req, res) => {
    if(!req.session.cartId) {
        return res.redirect('/');
    }
    const {productId} = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);
    const updatedItems = cart.items.filter((product) => product.productId != productId);
    const updatedCart = await cartsRepo.update(cart.id, {items:updatedItems});
    const {products, grandTotal} = await getProductDetails(updatedCart);
    return res.send(cartListing({cart:updatedCart, products, grandTotal}));
});




module.exports = router;