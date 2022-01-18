require('module-alias/register')
const express = require('express');
// const passport = require('passport')
const path = require('path')

const serverConfig = require('./config/server')
const db = require('@libs/Database')
const routes = require('./routes')

const app = express();

// DB connect
db.connect()

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true, limit: '50mb' }));
// app.use(passport.initialize());

// routes
routes(app)

// start server
app.listen(
    serverConfig.PORT,
    () => console.log(`Server running on ${serverConfig.HOST}:${serverConfig.PORT}`)
);