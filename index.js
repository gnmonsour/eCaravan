const express = require('express');
const app = express();
const usersRepo = require('./repositories/UsersRepository');

// middleware
const cs = require('cookie-session');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);
app.use(cs({ keys: [ 'mySecretCookieSalt' ] }));
const registerForm = `<h2>Register</h2><div>
<form method="POST">
<input name="email" type="email" placeholder="Email">
<input name="password" type="password" placeholder="Password">
<input name="passwordConfirmation" type="password" placeholder="Confirm Password">
<button>Sign Up</button>
</form>
</div>`;
const loginForm = `<h2>Log In</h2><div>
<form method="POST">
<input name="email" type="email" placeholder="Email">
<input name="password" type="password" placeholder="Password">
<button>Log In</button>
</form>
</div>`;
const homeView = `<h2>Home Page</h2>
<div>Welcome</div>`;
const signoutLink = `<p><a href="/signout">Sign out</a></p>`;
const registerLink = `<p><a href="/register">Register</a></p>`;
const loginLink = `<p><a href="/login">Login</a></p>`;


// routes
app.get('/register', (req, res) => {
	let markup = registerForm;
    // if (req.session.userId) markup += `<div>Session Userid: ${req.session.userId}</div>`;
    markup += loginLink;
	res.send(markup);
});

app.post('/register', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	if (await usersRepo.getFirst({ email })) {
		return res.send('email is taken');
	}

	if (password !== passwordConfirmation) {
		return res.send('Password confirmation does not match');
	}

	const attrs = await usersRepo.create({ email, password });
	req.session.userId = attrs.id;
	// return res.send(`account successfully created ${attrs.email}`);
});

app.get('/signout', (req, res) => {
	req.session = null;
	// res.send('Signed Out!');
	res.redirect('/login');
});

app.get('/login', (req, res) => {
    let markup = loginForm;
    markup += registerLink;
	res.send(markup);
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const candidate = await usersRepo.getFirst({ email });
	if (candidate && candidate.password === password) {
		req.session.userId = candidate.id;
		res.redirect('/');
	} else {
		res.send('Unable to login');
	}
});

app.get('/', async (req, res) => {
	let markup = homeView;
	if (req.session.userId){
        const user = await usersRepo.getOne(req.session.userId);
        if(user){
            markup += `<div>${user.email}</div>`;
            markup += signoutLink;
        }
    } 
	res.send(markup);
});

// server run
const port = +process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
