const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const sslRedirect = require('heroku-ssl-redirect');
require('dotenv').config();
const recipe = require('./routes/recipe.route');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.once('open', () => {
  console.log('MongoDB database connected');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const config = {
  required: false,
  auth0Logout: true,
  appSession: {
    secret: process.env.AUTH_SECRET,
  },
  baseURL: 'https://foodbase.ca/',
  clientID: process.env.AUTH_CLIENTID,
  issuerBaseURL: process.env.AUTH_ISSUER,
};

// use bodyparser to parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/*', function (req, res, next) {
  if (req.headers.host.match(/^www/) !== null) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
});

app.use(sslRedirect());
// serve static files using a new folder
app.use(express.static(path.join(__dirname, 'public')));
// use recipe routes
app.use('/recipe', recipe);

// public routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/browse', (req, res) => {
  res.sendFile(path.join(__dirname, 'browse.html'));
});

// authenticated routes require login
app.get('/dashboard', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/recform', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'recipeform.html'));
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(req.openid.user);
});

app.listen(process.env.PORT || 3000);
console.log('Server Running!');
