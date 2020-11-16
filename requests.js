`use strict`

const {https} = require('follow-redirects');

const OPTIONS = {
    'method': 'GET',
    'hostname': 'api.adjaranet.com',
    'path': '',
    'headers': {
        'authority': 'api.adjaranet.com',
        'x-source': 'adjaranet',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
        'origin': 'https://www.adjaranet.com',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://www.adjaranet.com/',
        'accept-language': 'en-US,en;q=0.9,ka;q=0.8'
    },
    'maxRedirects': 20
};

async function sendInternal(options) {
    return new Promise((resolve, reject) => {
        const response = https.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                try {
                    const body = Buffer.concat(chunks);

                    resolve(body.toString());
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });

            res.on('error', (err) => {
                console.error(err);
                reject(err);
            })
        });
        response.end();
    });
}

async function send(path) {
    OPTIONS.path = path;
    return await sendInternal(OPTIONS);
}

module.exports = {
    send
}