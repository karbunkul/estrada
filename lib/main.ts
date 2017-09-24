export interface IEstradaRouteInfo {
    route: string;
    pattern: RegExp;
    segments: string[];
    weight: number;
}

export interface IEstradaRoute {
    route: string;
    params: object[];
    query: object[];
}

export default class Estrada {
    private _routes: object;
    private _url: string;

    constructor(routes: string[] = []) {
        let patterns = {};
        routes.forEach((route) => {
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
            };

            if (!patterns.hasOwnProperty(count)) {
                patterns[count] = [
                    routeInfo
                ];
            }else {
                patterns[count].push(routeInfo);
            }
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
}