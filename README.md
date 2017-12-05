# Estrada #

[![Build Status](https://travis-ci.org/karbunkul/estrada.svg?branch=master)](https://travis-ci.org/karbunkul/estrada)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Synopsis
Lightweight isomorphic javascript router

[![NPM](https://nodei.co/npm/estrada.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/estrada/)

## API reference

### `match(url)`

* `url`: **required** url string (for example '/alive')

Return route object or false.

## How to use

Create instance Estrada.

```javascript

const estrada = require('estrada');

const routes = [
    {
        route: '/alive',
        meta: {foo: 'bar'}
    },
    '/user/:user',
    '/user/:user/delete',
];

const router = estrada(routes);
router.match(url);
```

© Alexander Pokhodyun (Karbunkul) 2017