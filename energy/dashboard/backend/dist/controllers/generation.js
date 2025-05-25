"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last24hPrice = exports.last24hGW = exports.latestPct = exports.last24hPct = void 0;
const last24hPct = (dao) => async (req, res, next) => {
    try {
        const rows = await dao.GenerationPctLastDay();
        res.json(toGenerationModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.last24hPct = last24hPct;
const latestPct = (dao) => async (req, res, next) => {
    try {
        const rows = await dao.GenerationPctLastDay();
        res.json(toGenerationModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.latestPct = latestPct;
const last24hGW = (dao) => async (req, res, next) => {
    try {
        const rows = await dao.GenerationGWLastDay();
        res.json(toGenerationModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.last24hGW = last24hGW;
const last24hPrice = (dao) => async (req, res, next) => {
    try {
        const rows = await dao.PriceLastDay();
        res.json(rows);
    }
    catch (error) {
        next(error);
    }
};
exports.last24hPrice = last24hPrice;
const toGenerationModel = (rows) => {
    const g = {
        froms: [],
        fuels: []
    };
    const fuels = new Map();
    rows.forEach(gr => {
        const newFromTS = !g.froms || g.froms[g.froms.length - 1] != gr.from_ts.toISOString();
        if (newFromTS) {
            g.froms.push(gr.from_ts.toISOString());
        }
        let fuelVal = fuels.get(gr.fuel);
        if (!fuelVal) {
            fuelVal = {
                fuel: gr.fuel,
                vals: [],
            };
            fuels.set(gr.fuel, fuelVal);
        }
        fuelVal.vals.push(gr.value);
    });
    fuels.forEach(v => {
        g.fuels.push(v);
    });
    return g;
};
//# sourceMappingURL=generation.js.map