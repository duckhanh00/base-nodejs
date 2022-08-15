const express = require('express');
const app = express();
const server = require("http").createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const passport = require('passport');

// Passport
app.use(passport.initialize());
app.use(passport.session());

require('./passport')(passport)

app.use(express.static(path.join(path.resolve('./'), 'public')));
app.use(flash());
app.use(session({ secret: process.env.SECRET_TOKEN, resave: false, saveUninitialized: false }));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require("cors")({credentials: true, origin: 'http://localhost:3000'}));
app.use("/upload/backgrounds", express.static("upload/backgrounds"));
app.use(cookieParser());

app.use('/api', require('../routes'));

module.exports = server
