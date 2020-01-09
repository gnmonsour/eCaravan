// requirements
const express = require('express');

// middleware
const { validationResult } = require('express-validator');
const router = express.Router();
const { handleErrors, requireAuth, guardIfSignedIn } = require('./middleware');

// templates and nav links TODO: going to need to centralize for reuse
const registerForm = require('../../views/admin/auth/register');
const loginForm = require('../../views/admin/auth/login');
const homeView = require('../../views/home');
const signoutLink = `<p><a href="/signout">Sign out</a></p>`;
const registerLink = `<p><a href="/register">Register</a></p>`;
const loginLink = `<p><a href="/login">Login</a></p>`;
const homeLink = `<p><a href="/">Home</a></p>`;

// validators
const {
	requireLoginEmail,
	requireLoginPassword,
	requireEmail,
	requirePassword,
	requirePasswordConfirmation
} = require('./validators');

// storage
const usersRepo = require('../../repositories/UsersRepository');

// wrappers facilitate template variables

const wrapLoginCall = async (req, res, errors = undefined) => {
	const nav = `${registerLink}${homeLink}`;
	const markup = await loginForm({ nav, errors, req });
	return res.send(markup);
};

// routes
router.get('/register', guardIfSignedIn,  (req, res) => {
	const nav = `${loginLink}${homeLink}`;
	const markup =  registerForm({ nav, formData: req.body });
	return res.send(markup);
});

router.post(
	'/register',
	guardIfSignedIn,
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(registerForm, (req) => {
		const formData = req.body;
		const nav = `${loginLink}${homeLink}`;
		return {formData, nav};
	}),
	async (req, res) => {
		const { email, password } = req.body;
		// TODO: do we need this return?
		const attrs = await usersRepo.create({ email, password });
		res.redirect('/login');
	}
);

router.get('/signout', requireAuth, (req, res) => {
	req.session = null;
	res.redirect('/');
});

router.get('/login', guardIfSignedIn, (req, res) => {
	wrapLoginCall(req, res);
});

router.post('/login', guardIfSignedIn, [ requireLoginEmail, requireLoginPassword ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		wrapLoginCall(req, res, errors);
	}
	else {
		const { email } = req.body;
		const candidate = await usersRepo.getFirst({ email });
		if (candidate) {
			req.session.userId = candidate.id;
			res.redirect('/admin/products');
		}
	}
});

router.get('/', async (req, res) => {
	let nav = ``;
	if (req.session.userId) {
		nav = `${signoutLink}`;
	}
	else {
		nav = `${loginLink}${registerLink}`;
	}

	const markup = await homeView({ req, nav });
	res.send(markup);
});

module.exports = router;
