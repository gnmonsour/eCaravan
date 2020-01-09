
// requirements
const express = require('express');
const app = express();

// externalize config
require('dotenv').config();

// routers
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

// middleware
const cs = require('cookie-session');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(express.static('public'));
app.use(urlencodedParser);
app.use(cs({ keys: [ process.env.SECRET_SALT ] }));
app.use(authRouter);
app.use(productsRouter);

// run server
const port = +process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
