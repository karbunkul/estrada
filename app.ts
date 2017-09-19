import * as http from 'http';
import Estrada from './lib/main';
import {IncomingMessage, ServerResponse} from 'http';

const routes = [
    '/ra/method/ra.version?id=123',
    '/ra/method/ra.entities',
    '/v2/ra/user/:id/delete',
    '/ig/:id',
];

const estrada = new Estrada(routes);
console.log(estrada.routes);

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const response = estrada.match(req.url);
    res.end(JSON.stringify(response));

    // res.end('{"segments":5,"pattern":{},"route":"/v2/ra/user/:id/delete","query":{"extra":"123","q":"2"}}');

});

server.listen(3000, (err) => {
    // console.log(estrada.routes);
    if (err) {
        return console.log('something bad happened', err);
    }
});