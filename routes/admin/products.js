const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

// middleware
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const { handleErrors, requireAuth } = require('./middleware');

// template & message strings
const newProductForm = require('../../views/admin/products/new');
const editProductForm = require('../../views/admin/products/edit');
const productListing = require('../../views/admin/products/index');

// validators
const { requireTitle, requirePrice } = require('./validators');

// storage
let productsRepo = require('../../repositories/ProductsRepository');

// routes
router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    const markup = await productListing({products});
	res.send(markup);
});

router.get('/admin/products/new', requireAuth, async (req, res) => {
	// if(req.session.userId){
	const markup = await newProductForm({});
	return res.send(markup);
	// }
	// return res.send('products new page');
});

// the order of middleware is important to the error validation middleware
// the multipart form middleware should be invoked before the validation
// middleware in the argument list
router.post('/admin/products/new', requireAuth, upload.single('image'), [ requireTitle, requirePrice ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const markup = await newProductForm({ errors, req });
		return res.send(markup);
	}
	else {
		let image;
		if (req.file) image = req.file.buffer.toString('base64');
		const { title, price } = req.body;
		try {
			await productsRepo.create({ title, price, image });
		} catch (error) {
			// in case where repo has been deleted or destroyed
			if (error.code === 'ENOENT') {
				console.log('retrying to build repo and post');
				productsRepo.createOrRecoverStore();
				await productsRepo.create({ title, price, image });
			}
			else {
				throw new Error('Failed to create new product.');
			}
		}
	}
	res.redirect('/admin/products');
});

router.get('/admin/products/:id/edit', requireAuth, async(req, res) => {
    const product = await productsRepo.getOne(req.params.id);
    if(!product) {
        return res.send('Product not found');
    }
    const markup = await editProductForm({errors: null, product});
	return res.send(markup);
});

router.post('/admin/products/:id/edit', 
        requireAuth, 
        upload.single('image'), 
        [requireTitle, requirePrice], 
        async(req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const markup = await editProductForm({ errors, product });
		return res.send(markup);
	}
	else {
        const updates = req.body;

        if(req.file){
            updates.image = req.file.buffer.toString('base64');
        }
        try {
			await productsRepo.update(req.params.id, updates);
		} catch (error) {
			// in case where repo has been deleted or destroyed
			if (error.code === 'ENOENT') {
				console.log('retrying to build repo and post');
                productsRepo.createOrRecoverStore();
                // pass on any other error for now
				await productsRepo.update(req.params.id,updates);
			}
			else {
				return res.send('Failed to update product.');
			}
		}
	}
	res.redirect('/admin/products');
});

router.get('/admin/products/:id/delete', requireAuth, (req, res) => {
    console.log('delete', req.params.id);
});

module.exports = router;
