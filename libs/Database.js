const mongoose = require('mongoose')
const mongoURI = require('@config/database').DB_URI

async function connect() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully!!!');
    } catch (err) {
        console.log(err.message);
        process.exit(1)
    }
}

module.exports = { connect }