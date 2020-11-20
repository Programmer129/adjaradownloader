`use strict`

const fs = require('fs');
const path = require('path');
const express = require("express");
const mime = require('mime');
const got = require('got');
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
        movieId: Joi.string().optional(),
        fileId: Joi.string().optional()
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
        // const {movieId, fileId} = req.body;
        // console.log(req.body);

        const file = 'movie.mp4';

        const filename = path.basename(file);
        const mimetype = mime.getType(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', `${mimetype}; charset=UTF-8`);
        const url = `https://api.adjaranet.com/api/v1/movies/${878496841}/files/${1397146}`;

        const stream = got.stream(url);

        stream
            .on("downloadProgress", ({ transferred, total, percent }) => {
                const percentage = Math.round(percent * 100);
                console.info(`progress: ${transferred}/${total} (${percentage}%)`);
            })
            .on("error", (error) => {
                console.error(`Download failed: ${error.message}`);
            });

        res
            .on("error", (error) => {
                console.error(`Could not write file to system: ${error.message}`);
            })
            .on("finish", () => {
                console.log(`File downloaded to ${file}`);
            });

        stream.pipe(res);
        // download(res, movieId, fileId);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;