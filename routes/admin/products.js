const express = require('express');
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
const { requireTitle, requirePrice, requireInventory } = require('./validators');

// storage
let productsRepo = require('../../repositories/ProductsRepository');

// routes
router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	const markup = await productListing({ products });
	res.send(markup);
});

router.get('/admin/products/new', requireAuth, async (req, res) => {
	const markup = await newProductForm({});
	return res.send(markup);
});

// the order of middleware is important
// because the req object is transformed,
// the multipart form middleware (upload.single) must be invoked
// before the validation middleware [require*, [require*]]
router.post(
	'/admin/products/new',
	requireAuth,
	upload.single('image'),
	[ requireTitle, requirePrice, requireInventory ],
	handleErrors(newProductForm),
	async (req, res) => {
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
		res.redirect('/admin/products');
	}
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	const formData = await productsRepo.getOne(req.params.id);
	if (!formData) {
		return res.send('Product not found');
	}
	const markup = editProductForm({ formData });
	return res.send(markup);
});

router.post(
	'/admin/products/:id/edit',
	requireAuth,
	upload.single('image'),
	[ requireTitle, requirePrice, requireInventory ],
	handleErrors(editProductForm, async (req) => {
		const formData = await productsRepo.getOne(req.params.id);
		return { formData };
	}),
	async (req, res) => {
		const updates = req.body;

		if (req.file) {
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
				await productsRepo.update(req.params.id, updates);
			}
			else {
				return res.send('Failed to update product.');
			}
		}
		res.redirect('/admin/products');
	}
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {

	const candidate = await productsRepo.delete(req.params.id);
	// console.log(`deleted ${candidate.title} with id: ${candidate.id}` );
	return res.redirect('/admin/products');
});

module.exports = router;
