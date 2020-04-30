const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const { auth } = require("express-openid-connect");
require("dotenv").config();
const { requiresAuth } = require("express-openid-connect");

const config = {
  required: false,
  auth0Logout: true,
  appSession: {
    secret: process.env.AUTH_SECRET
  },
  baseURL: "http://localhost:3000",
  clientID: process.env.AUTH_CLIENTID,
  issuerBaseURL: process.env.AUTH_ISSUER
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.sendDile(
    req.isAuthenticated()
      ? path.join(__dirname + "/../frontend/dashboard.html")
      : path.join(__dirname + "/../frontend/index.html")
  );
});

app.use(express.static(path.join(__dirname, "/../frontend")));

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.openid.user));
});

router.get("/callback", function(req, res) {
  res.sendFile(path.join(__dirname + "/../frontend/index.html"));
});

router.get("/dashboard", function(req, res) {
  res.sendFile(path.join(__dirname + "/../frontend/dashboard.html"));
});

//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
