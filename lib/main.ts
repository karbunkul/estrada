import Estrada, {IEstradaOptions} from './estrada';

const estrada = (routes: any[], options?: IEstradaOptions ): Estrada => {
    return new Estrada(routes, options);
};

module.exports = estrada;
module.exports.default = estrada;