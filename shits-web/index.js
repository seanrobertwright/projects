const express = require('express');
const app = express();
const compression = require('compression');
const open = require('open');
const serverIndex = require('serve-index');

const port = process.env.PORT || 8888;

const publicPath = '/sdk';

const directory = __dirname + publicPath;

const launchURL = 'http://localhost:' + port + publicPath;

const year = 60 * 60 * 24 * 365 * 1000;

// middleware
// use compression to gzip content
app.use(compression());

// set the default mime type to xml
express.static.mime.default_type = "text/xml";

// serve content
app.use(publicPath, express.static(directory, { MaxAge: year, hidden:true}));

app.use("/", serverIndex(__dirname, {'icons': true}));

app.listen(port);

open(launchURL);

console.log("OpenUI5 SDK server running at\n  =>" + launchURL + "\nCTRL + C to shutdown");
