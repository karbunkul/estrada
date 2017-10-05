export interface IEstradaRouteInfo {
    route: string;
    pattern: RegExp;
    segments: string[];
    meta: any;
    weight: number;
}

export interface IEstradaRoute {
    route: string;
    params: object[];
    query: object[];
    meta: any;
}

export interface IEstradaOptions {
    onError?: Function;
}

class Estrada {
    private _routes: object;
    private _url: string;
    private _onError: Function;

    constructor(routes: any[] = [], options?: IEstradaOptions) {
        let patterns = {};
        let route: string = '';
        let meta: any = {};
        let invalid = false;
        this._onError = (options) ? options.onError : undefined;
        routes.forEach((item) => {
            if ((typeof item == 'object')) {
                if (item.hasOwnProperty('route') && item.hasOwnProperty('meta')) {
                    route = item.route;
                    meta = item.meta;
                }else{
                    invalid = true;
                }
            }
            if (!invalid) {
                route = route.replace(/^\//, '');
                const
                    pattern = /(:.[^\/]+)/g,
                    segments = route.split('/'),
                    count = segments.length,
                    regexp = new RegExp(`${route}$`.replace(pattern, '(.[^/]*)'), 'g');

                let routeInfo: object = {
                    pattern: regexp,
                    segments: segments,
                    route: `/${route}`,
                    meta: meta,
                };

                if (!patterns.hasOwnProperty(count)) {
                    patterns[count] = [
                        routeInfo
                    ];
                }else {
                    patterns[count].push(routeInfo);
                }
            }else {
                this.onError(`invalid route ${JSON.stringify(item)}`);
            }

            meta = {};
            route = '';
            invalid = false;
        });
        this._routes = patterns;
    }

    get routes() {
        return this._routes;
    }

    public match(url: string): IEstradaRoute | boolean {
        this._url = url;
        url = url
            .trim()
            .replace(/^(\/)/, '')
            .replace(/(|\/)\?.*/, '');
        const parts = url.split('/'),
            count = parts.length;
        let matches = [];
        if (this.routes.hasOwnProperty(count)) {
            this.routes[count].forEach((route) => {
                let matched = url.match(route.pattern);
                if (matched) matches.push(route);
            });
        }else {
            return false;
        }
        return this.findRoute(parts, matches);
    }

    /**
     * Parse query from url string
     * @param {string} raw
     * @returns {Object}
     */
    private parseQuery(): object[] {
        let query: object[] = [];
        this._url
            .replace(/^.*\?/, '')
            .split('&')
            .forEach((arg) =>{
                let pair = arg.split('=');
                if (pair.length == 2) query.push({
                    name: pair[0],
                    value: pair[1]
                });
            });
        return query;
    }

    /**
     * Parse params from url string
     * @param {string[]} parts
     * @param {string[]} segments
     * @returns {Object[]}
     */
    private parseParams(parts: string[], segments: string[]): object[] {
        let params: object[] = [];
        segments.forEach((segment, index) =>{
            if (segment.charAt(0) == ':') {
                params.push({
                    name: segment.substr(1),
                    value: parts[index],
                });
            }
        });
        return params;
    }

    /**
     * Sort routes by weight
     * @param {IEstradaRouteInfo[]} suggested
     * @returns {Object}
     */
    private sortByWeight(suggested: IEstradaRouteInfo[]): IEstradaRouteInfo {
        suggested.sort((a, b) =>{
            return (b.weight - a.weight);
        });
        return suggested[0];
    }

    private findRoute(parts: string[], routes: IEstradaRouteInfo[]): IEstradaRoute | boolean {
        switch (routes.length) {
            case 0: return false;
            case 1: {
                return {
                    route: routes[0].route,
                    query: this.parseQuery(),
                    params: this.parseParams(parts, routes[0].segments),
                    meta: routes[0].meta,
                };
            }
            default: {
                // calc suggested weight
                routes.forEach((routeInfo) => {
                    routeInfo.weight = this.calcSuggestedWeight(parts, routeInfo.segments);
                });
                // sort by weight and get route
                const route = this.sortByWeight(routes);
                return {
                    route: route.route,
                    query: this.parseQuery(),
                    params: this.parseParams(parts, route.segments),
                    meta: route.meta,
                };
            }
        }
    }

    /**
     * Calculate suggested weight
     * @param {string[]} parts
     * @param {string[]} route
     * @returns {number}
     */
    private calcSuggestedWeight(parts: string[], route: string[]): number {
        let weight = 0;
        parts.forEach((part, index) => {
            if (part == route[index]) {
                weight+= 400;
            }else {
                if (route[index].charAt(0) != ':') {
                    weight-= 400;
                }else {
                    weight+= 100;
                }
            }
        });
        return weight;
    }

    private onError(err: string|Error) {
        if (this._onError) this._onError(err);
    }
}

module.exports = function (routes: any[], options?: IEstradaOptions ): Estrada {
    return new Estrada(routes, options);
};