`use strict`

const {parse} = require('url');
const {send} = require('./requests');

function parseUrl(url) {
    const parsed = parse(url);
    const parts = parsed.pathname.split("/").filter(p => p.length > 0);

    return parts[1];
}

async function main(url) {
    const id = parseUrl(url);
    const body = JSON.parse(await send(`/api/v1/movies/${id}?source=adjaranet`));
    console.info(body.data);
    const fileBody = await send(`/api/v1/movies/${body.data.id}/season-files/0?source=adjaranet`);
    console.info(JSON.stringify(JSON.parse(fileBody)));
}

main('https://www.adjaranet.com/movies/1483/True-Lies?lang=ENG&quality=HD');