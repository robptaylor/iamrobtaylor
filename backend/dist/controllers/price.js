"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastWeekPrice = exports.last24hPrice = void 0;
const last24hPrice = (dao) => async (req, res, next) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const rows = await dao.Prices(date);
        res.json(toModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.last24hPrice = last24hPrice;
const lastWeekPrice = (dao) => async (req, res, next) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const rows = await dao.Prices(date);
        res.json(toModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.lastWeekPrice = lastWeekPrice;
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