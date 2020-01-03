
// requirements
const express = require('express');
const app = express();
const authRouter = require('./routes/admin/auth');

// externalize config
require('dotenv').config();

// middleware
const cs = require('cookie-session');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(urlencodedParser);
app.use(cs({ keys: [ process.env.SECRET_SALT ] }));
app.use(authRouter);


// run server
const port = +process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
