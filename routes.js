`use strict`

const fs = require('fs');
const path = require('path');
const express = require("express");
const mime = require('mime');
const {validate, Joi} = require('express-validation');
const {fetch, download} = require('./adjaraParser');

const router = express.Router();

const searchValidation = {
    body: Joi.object({
        url: Joi.string()
            .required()
    }),
};

const downloadValidation = {
    body: Joi.object({
        movieId: Joi.string().required(),
        fileId: Joi.string().required()
    }),
};

router.post("/search", validate(searchValidation, {}, {}), async (req, res, next) => {
    try {
        const {url} = req.body;

        const result = await fetch(url);

        res.status(200).json(result);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post("/download", validate(downloadValidation, {}, {}), (req, res, next) => {
    try {
        const {movieId, fileId} = req.body;

        const file = 'movie.mp4';

        const filename = path.basename(file);
        const mimetype = mime.getType(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        download(res, movieId, fileId);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;