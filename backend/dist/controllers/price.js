"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last24hPrice = void 0;
const last24hPrice = (dao) => async (req, res, next) => {
    try {
        const rows = await dao.PriceLastDay();
        res.json(toModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.last24hPrice = last24hPrice;
const toModel = (rows) => {
    const prices = {
        froms: [],
        vals: []
    };
    rows.forEach(x => {
        prices.froms.push(x.from_ts.toISOString());
        prices.vals.push(x.value);
    });
    return prices;
};
//# sourceMappingURL=price.js.map