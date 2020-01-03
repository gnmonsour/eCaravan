// Strings
const registerForm = require('../../views/admin/auth/register');
const loginForm = require('../../views/admin/auth/login');
const homeView = require('../../views/home');
const signoutLink = `<p><a href="/signout">Sign out</a></p>`;
const registerLink = `<p><a href="/register">Register</a></p>`;
const loginLink = `<p><a href="/login">Login</a></p>`;
const homeLink = `<p><a href="/">Home</a></p>`;
const emailError = `<h3>User not found!</h3>`;
const emailDuplicateError = `<h3>Email already in use!</h3>`;
const passwordError = `<h3>Password error!</h3>`;
const confirmationError = `<h3>Password confirmation error!</h3>`;

// requirements
const express = require('express');
const usersRepo = require('../../repositories/UsersRepository');

const router = express.Router();

// guard
const guardIfSignedIn = (req, res) => {
	if (req.session.userId) {
		res.redirect('/');
	}
};

// routes
router.get('/register', (req, res) => {
	guardIfSignedIn(req, res);
	const nav = `${loginLink}${homeLink}`;
	const markup = registerForm({ req, nav });
	res.send(markup);
});

router.post('/register', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	if (await usersRepo.getFirst({ email })) {
		return res.send(emailDuplicateError + registerLink);
	}
	if (password !== passwordConfirmation) {
		return res.send(confirmationError + registerLink);
	}
	// TODO: do we need this return?
	const attrs = await usersRepo.create({ email, password });
	res.redirect('/login');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/');
});

router.get('/login', (req, res) => {
	guardIfSignedIn(req, res);
	const nav = `${registerLink}${homeLink}`;
	const markup = loginForm({ req, nav });
	res.send(markup);
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const candidate = await usersRepo.getFirst({ email });
	if (!candidate) {
		return res.send(emailError + loginLink);
	}
	const isValidPassword = await usersRepo.validatedPassword(password, candidate.password);
	if (!isValidPassword) {
		return res.send(passwordError + loginLink);
	}
	req.session.userId = candidate.id;
	res.redirect('/');
});

router.get('/', async (req, res) => {
	let nav = ``;
	if (req.session.userId) {
		nav = `${signoutLink}`;
	} else {
		nav = `${loginLink}${registerLink}`;
	}

	const markup = await homeView({ req, nav });
	res.send(markup);
});

module.exports = router;
