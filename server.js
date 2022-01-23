require('module-alias/register')
const express = require('express');
// const passport = require('passport')
const path = require('path')

const db = require('@libs/Database')
const routes = require('./routes')

const app = express();

// DB connect
db.connect()

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true, limit: '50mb' }));
// app.use(passport.initialize());

// routes
routes(app)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

// start server
app.listen(process.env.PORT || 5001);