import * as http from 'http';
import Estrada from './lib/main';
import {IncomingMessage, ServerResponse} from 'http';

const routes = [
    '/:city/product/:name',
    '/ra/product/:name',
    '/ra/product/ra.entities',
    '/v2/ra/user/:id/delete',
    '/ig/:id',
    '/:id',
    '/alive',
    '/user/:user',
    '/user/1'
];

const estrada = new Estrada(routes);

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = (req.method == 'GET') ? decodeURI(req.url) : req.url,
        response = estrada.match(url);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

server.listen(3000, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
});