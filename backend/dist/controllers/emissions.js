"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastWeekEmissions = exports.last24hEmissions = void 0;
const last24hEmissions = (dao) => async (req, res, next) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const rows = await dao.Emissions(date);
        res.json(toModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.last24hEmissions = last24hEmissions;
const lastWeekEmissions = (dao) => async (req, res, next) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const rows = await dao.Emissions(date);
        res.json(toModel(rows));
    }
    catch (error) {
        next(error);
    }
};
exports.lastWeekEmissions = lastWeekEmissions;
const toModel = (rows) => {
    const emissions = {
        froms: [],
        vals: []
    };
    rows.forEach(x => {
        emissions.froms.push(x.from_ts.toISOString());
        emissions.vals.push(x.intensity_g_per_kwh);
    });
    return emissions;
};
//# sourceMappingURL=emissions.js.map