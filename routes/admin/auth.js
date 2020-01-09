// requirements
const express = require('express');

// middleware
const router = express.Router();
const { handleErrors, requireAuth, guardIfSignedIn } = require('./middleware');

// templates and nav links TODO: centralize for reuse
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

// routes
router.get('/register', guardIfSignedIn, (req, res) => {
	const nav = `${loginLink}${homeLink}`;
	const markup = registerForm({ nav, formData: req.body });
	return res.send(markup);
});

router.post(
	'/register',
	guardIfSignedIn,
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(registerForm, (req) => {
		const formData = req.body;
		const nav = `${loginLink}${homeLink}`;
		return { formData, nav };
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
	const nav = `${registerLink}${homeLink}`;
	const markup = loginForm({ nav, formData: req.body });
	return res.send(markup);
});

router.post(
	'/login',
	guardIfSignedIn,
	[ requireLoginEmail, requireLoginPassword ],
	handleErrors(loginForm, (req) => {
		const formData = req.body;
		const nav = `${registerLink}${homeLink}`;
		return { formData, nav };
	}),
	async (req, res) => {
		const { email } = req.body;
		const candidate = await usersRepo.getFirst({ email });
		if (candidate) {
			req.session.userId = candidate.id;
			res.redirect('/admin/products');
		}
	}
);

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
