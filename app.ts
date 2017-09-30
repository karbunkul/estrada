import {IncomingMessage, ServerResponse} from "http";

const http = require('http');
const estrada = require('./lib/main');

const routes = [
    '/:city/product/:name',
    '/alive',
    '/:city',
    '/user/:user',
    '/user/:user/delete',
];

const router = estrada(routes);

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = (req.method == 'GET') ? decodeURI(req.url) : req.url,
        response = router.match(url);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

server.listen(3000, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
});