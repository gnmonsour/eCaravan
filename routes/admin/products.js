const express = require('express');

const router = express.Router();

router.get('/admin/products', (req, res) => {
    res.send('products page');
});

router.get('/admin/products/new', (req, res) => {
    res.send('products new page');
});

module.exports = router;