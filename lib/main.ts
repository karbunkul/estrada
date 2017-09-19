import {isArray} from "util";

export interface IEstradaRouteInfo {
    route: string;
    params?: object[];
    query?: object[]
}

export default class Estrada {
    private _routes: any;

    constructor(routes: string[] = []) {

        let patterns = {};
        routes.forEach((route) => {
            const pattern = /(:.[^\/]+)/g;
            route = route.replace(/(|\/)\?.*/, '');
            let segments = route.split('/').length -1;
            const regexp = new RegExp(`^${route}$`.replace(pattern, '(.[^/]*)'), 'g');

            let routeInfo = {
                segments: segments,
                pattern: regexp,
                route: route,
            };

            if (!patterns.hasOwnProperty(segments)) {
                patterns[segments] = [
                    routeInfo
                ];
            }else {
                patterns[segments].push(routeInfo);
            }
        });
        this._routes = patterns;
    }

    get routes() {
        return this._routes;
    }

    public match(url: string): object | boolean {
        let routeInfo: object;
        // get raw query
        const rawQuery = url.replace(/(.*)\?(.*)/, '$2') || undefined;

        url = url.replace(/(|\/)\?.*/, '');
        const segments = url.split('/').length - 1;
        let resolved = false;
        if (this.routes.hasOwnProperty(segments)) {
            this.routes[segments].forEach((route) => {
                if (!resolved) {
                    let matched = url.match(route.pattern);
                    if (matched) {
                        resolved = true;
                        routeInfo = {
                            ...route,
                            query: this.parseQuery(rawQuery),
                        };
                    }
                }

            });
        }
        return (routeInfo) ? routeInfo : false;
    }

    private parseQuery(raw: string = ''): object {
        let query: object = {};
        raw.split('&').forEach((arg) =>{
            let pair = arg.split('=');
            if (pair.length == 2) query[pair[0]] = pair[1];
        });
        return query;
    }

    private parseParams(url: string, regexp: RegExp): object {
        let params: object = {};
        return params;
    }
}