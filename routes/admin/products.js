const newProduct = require('../../views/admin/products/new');

const express = require('express');

const router = express.Router();

router.get('/admin/products', (req, res) => {
    res.send('products page');
});

router.get('/admin/products/new', async (req, res) => {
    let errors = undefined;
    console.log(req.session);
    // if(req.session.userId){
        const markup = await newProduct({errors});
        return res.send(markup)
    // } 
    // return res.send('products new page');
});

module.exports = router;