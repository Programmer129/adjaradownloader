`use strict`

const {parse} = require('url');
const {v4: uuidv4} = require('uuid');
const {send} = require('./requests');

const PROGRESS = {};

function mapQuality(quality) {
    switch (quality) {
        case "HD":
            return "HIGH";
        case "SD":
            return "MEDIUM";
        default:
            return quality;
    }
}

function parseUrl(url) {
    const parsed = parse(url);
    const parts = parsed.pathname.split("/").filter(p => p.length > 0);
    const params = parsed.query.split("&");
    const langParam = params[0].split("=");
    const qualityParam = params[1].split("=");
    let lang, quality;

    if (langParam && langParam.length > 0) {
        lang = langParam[1];
    }

    if (qualityParam && qualityParam.length > 0) {
        quality = mapQuality(qualityParam[1]);
    }

    return {
        id: parts[1],
        name: parts[2],
        lang: lang,
        quality: quality
    };
}

function parseFileUrl(url) {
    const parsed = parse(url);
    const parts = parsed
        .pathname
        .split("/")
        .filter(p => p.length > 0)
        .filter(p => !isNaN(Number(p)));

    return {
        movieId: parts[0],
        fileId: parts[1]
    }
}

async function fetch(url) {
    const details = parseUrl(url);
    const {id, name, lang, quality} = details;
    const body = JSON.parse(await send(`/api/v1/movies/${id}?source=adjaranet`));
    const fileBody = JSON.parse(await send(`/api/v1/movies/${body.data.id}/season-files/0?source=adjaranet`));
    const files = fileBody.data[0].files;
    let byLang, byQuality;

    if (lang) {
        byLang = files.find(file => file.lang === lang);
    } else {
        byLang = fileBody.data[0].files[0];
    }

    if (quality) {
        byQuality = byLang.files.find(file => file.quality === quality);
    } else {
        byQuality = byLang.files[0];
    }

    const {movieId, fileId} = parseFileUrl(byQuality.src);

    return {
        movieId,
        fileId,
        name,
        duration: byQuality.duration,
        quality: byQuality.quality,
        language: byLang.lang,
        id: uuidv4()
    };
}

module.exports = {
    fetch,
    PROGRESS
}