// requirements
const express = require('express');

// middleware
const { validationResult } = require('express-validator');
const router = express.Router();

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

// authentication guard
const guardIfSignedIn = (req, res) => {
	if (req.session.userId) {
		res.redirect('/');
	}
};

// wrappers facilitate template variables
const wrapRegisterCall = async (req, res, errors = undefined) => {
	const nav = `${loginLink}${homeLink}`;
	const markup = await registerForm({ nav, errors, req });
	return res.send(markup);
};
const wrapLoginCall = async (req, res, errors = undefined) => {
	const nav = `${registerLink}${homeLink}`;
	const markup = await loginForm({ nav, errors, req });
	return res.send(markup);
};

// routes
router.get('/register', (req, res) => {
	guardIfSignedIn(req, res);
	wrapRegisterCall(req, res);
});

router.post('/register', [ requireEmail, requirePassword, requirePasswordConfirmation ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		wrapRegisterCall(req, res, errors);
	}
	else {
		const { email, password } = req.body;
		// TODO: do we need this return?
		const attrs = await usersRepo.create({ email, password });
		res.redirect('/login');
	}
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/');
});

router.get('/login', (req, res) => {
	guardIfSignedIn(req, res);
	wrapLoginCall(req, res);
});

router.post('/login', [ requireLoginEmail, requireLoginPassword ], async (req, res) => {
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
