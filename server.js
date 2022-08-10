/* eslint no-console: 0 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.development';

const app = express();
const compiler = webpack(config);
const PORT = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

var syncDB = require("./src/syncDB");

app.use(bodyParser.json());

/**
 * Connect to database
 */
// var dbUrl = "mongodb://root:bestapp@ds157469.mlab.com:57469/best-test-app";
var dbUrl = "mongodb://localhost/best";
mongoose.connect(dbUrl);
mongoose.connection.on("error", function(err) {
    // console.log(err);
});

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
}));

app.use(webpackHotMiddleware(compiler));

app.listen(PORT, 'localhost', err => {
    if (err) {
        console.error(err);
        return;
    }

    // console.log(`Listening at http://localhost:${PORT}`);
});

function checkInternet() {
    require('dns').lookup('google.com', function(err) {
        if (err && err.code == "ENOTFOUND") {
            console.log('internet-not-connected');
        }else {
            syncDB.sync();
            console.log('db-sync-finished');
        }
    })
}

checkInternet();
setInterval(checkInternet, 300000);



//Import models
require("./src/models/projects");
require("./src/models/pipes");
require("./src/models/scansB");
require("./src/models/scansA");
require("./src/models/manualFields");

//Import routes
require('./config/routes')(app);

//Export module
exports = module.exports = app;
