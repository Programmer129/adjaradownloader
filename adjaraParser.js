`use strict`

const {parse} = require('url');
const {send, streamFile} = require('./requests');

function parseUrl(url) {
    const parsed = parse(url);
    const parts = parsed.pathname.split("/").filter(p => p.length > 0);

    return parts[1];
}

async function fetch(url) {
    const id = parseUrl(url);
    const body = JSON.parse(await send(`/api/v1/movies/${id}?source=adjaranet`));
    const fileBody = await send(`/api/v1/movies/${body.data.id}/season-files/0?source=adjaranet`);
    console.info(JSON.parse(fileBody).data[0].files[0].files[0]);

    return JSON.parse(fileBody).data[0].files;
}

function download(response, movieId, fileId) {
     streamFile(response, `/api/v1/movies/${movieId}/files/${fileId}`);
}

module.exports = {
    fetch,
    download
}