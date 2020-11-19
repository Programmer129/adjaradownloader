`use strict`

const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(timeout('3600000'));

app.use("/api", routes);

app.use(function(err, req, res, next) {
    if (err.statusCode) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});

app.listen(port, () => {
    console.info(`Application running on port: ${port}`);
});