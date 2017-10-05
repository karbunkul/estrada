# Estrada #

[![Build Status](https://travis-ci.org/karbunkul/estrada.svg?branch=master)](https://travis-ci.org/karbunkul/estrada)

## Synopsis
Lightweight isomorphic javascript router

[![NPM](https://nodei.co/npm/estrada.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/estrada/)

## API reference

### `match(url)`

* `url`: **required** url string (for example req.url)

Return IEstradaRoute object or false.

## Types ##

### IEstradaRoute ###
```
{
    "route": string,
    "query": object[],
    "params": object[],
}
```

## How to use

Create instance Estrada.

```javascript

const estrada = required('estrada', {
    onError: (err) => console.warn(err),
});

const routes = [
    '/:city/product/:name',
    {
        route: '/alive',
        meta: {foo: 'bar'}
    },
    '/:city',
    '/user/:user',
    '/user/:user/delete',
];

const router = estrada(routes);
```
Find route by url.
```javascript
router.match(url);
```

© Alexander Pokhodyun (Karbunkul) 2017