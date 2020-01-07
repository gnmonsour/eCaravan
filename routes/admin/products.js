const newProductForm = require('../../views/admin/products/new');

const express = require('express');
const router = express.Router();
const { requireTitle,
        requirePrice } = require('./validators');
const {validationResult} = require('express-validator');

router.get('/admin/products', (req, res) => {
    res.send(`<p><a href="/admin/products/new">Create Product</a>`);
});

router.get('/admin/products/new', 
 async (req, res) => {
    // if(req.session.userId){
        const markup = await newProductForm({});
        return res.send(markup)
    // } 
    // return res.send('products new page');
});

router.post('/admin/products/new', [requireTitle, requirePrice],
async (req, res) => {
    const errors = validationResult(req);
    // console.log(req.body);
    if(!errors.isEmpty()) {
        const markup = await newProductForm({errors, req});
        return res.send(markup)
    } 
    res.redirect('/');
}
);

module.exports = router;