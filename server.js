const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
require('dotenv').config();
const recipe = require('./routes/recipe.route');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
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
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH_CLIENTID,
  issuerBaseURL: process.env.AUTH_ISSUER,
};

// use bodyparser to parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
// serve static files
app.use(express.static(path.join(__dirname, 'public')));
// use recipe routes
app.use('/recipe', recipe);

app.get('/dashboard', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});
app.get('/recform', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname + '/public/recipeform.html'));
});
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(req.openid.user);
});

app.listen(process.env.port || 3000);
console.log('Running at Port 3000');
