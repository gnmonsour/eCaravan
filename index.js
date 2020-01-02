// Strings
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
const homeView = `<h2>Home Page</h2><div>Welcome</div>`;
const signoutLink = `<p><a href="/signout">Sign out</a></p>`;
const registerLink = `<p><a href="/register">Register</a></p>`;
const loginLink = `<p><a href="/login">Login</a></p>`;
const emailError = `<h3>User not found!</h3>`;
const emailDuplicateError = `<h3>Email already in use!</h3>`;
const passwordError = `<h3>Password error!</h3>`;
const confirmationError = `<h3>Password confirmation error!</h3>`;

// requirements
const express = require('express');
const app = express();
const usersRepo = require('./repositories/UsersRepository');

// middleware
const cs = require('cookie-session');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);
app.use(cs({ keys: [ 'mySaltySecretCookie' ] }));

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
		return res.send(emailDuplicateError + registerLink);
	}
	if (password !== passwordConfirmation) {
		return res.send(confirmationError + registerLink);
	}
	const attrs = await usersRepo.create({ email, password });
	res.redirect('/login');
});

app.get('/signout', (req, res) => {
	req.session = null;
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
    if(!candidate) {
        return res.send(emailError + loginLink);
    }
	if (candidate.password !== password) {
        return res.send(passwordError + loginLink);
    }  
    req.session.userId = candidate.id;
    res.redirect('/');
});

app.get('/', async (req, res) => {
	let markup = homeView;
	if (req.session.userId){
        const user = await usersRepo.getOne(req.session.userId);
        if(user){
            markup += `<div>${user.email}</div>`;
            markup += signoutLink;
        }
    } else {
        markup += loginLink + registerLink;
    }
	res.send(markup);
});

// run server
const port = +process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
