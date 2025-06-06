"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAO = void 0;
class DAO {
    pgClient;
    constructor(pgClient) {
        this.pgClient = pgClient;
    }
    async GenerationPctLastDay() {
        return this.query(`
            SELECT DATE_TRUNC('HOUR', from_ts) as from_ts, fuel, AVG(percent) as value
            FROM energy.generation
            WHERE from_ts >= '${this.dayAgoISOString()}'
            GROUP BY DATE_TRUNC('HOUR', from_ts), fuel
            ORDER BY DATE_TRUNC('HOUR', from_ts), fuel`);
    }
    async GenerationPctLatest() {
        return this.query(`
            SELECT from_ts, fuel, percent as value FROM energy.generation
            WHERE from_ts = (SELECT MAX(from_ts) FROM energy.generation)`);
    }
    async GenerationGWLastDay() {
        return this.query(`
            WITH normalized_fuels AS (
            SELECT DATE_TRUNC('HOUR', from_ts) as from_ts,
            CASE 
                WHEN fuel = 'BIOMASS' THEN 'biomass' 
                WHEN fuel = 'CCGT' THEN 'gas'
                WHEN fuel = 'NPSHYD' THEN 'hydro'
                WHEN fuel = 'COAL' THEN 'coal'
                WHEN fuel = 'NUCLEAR' THEN 'nuclear'
                WHEN fuel = 'OCGT' THEN 'gas'
                WHEN fuel = 'OIL' THEN 'oil'
                WHEN fuel = 'WIND' THEN 'wind'
                WHEN fuel = 'PS' THEN 'hydro'
            END as fuel, 
            mw
            FROM energy.generation_elexon 
            WHERE from_ts >= '${this.dayAgoISOString()}'
            AND fuel in ('BIOMASS', 'CCGT', 'NPSHYD', 'COAL', 'NUCLEAR', 'OCGT', 'OIL', 'WIND', 'PS')
            )
            SELECT from_ts, fuel, AVG(mw)/1000 as value FROM normalized_fuels
            group by from_ts, fuel
            ORDER BY from_ts, fuel`);
    }
    async Prices(from) {
        return this.query(`
            SELECT from_ts, price_mwh as value
            FROM energy.elexon_price
            WHERE from_ts >= '${from.toISOString()}'
            ORDER BY from_ts`);
    }
    async Emissions(from) {
        return this.query(`
            SELECT from_ts, intensity_g_per_kwh
            FROM energy.emissions
            WHERE from_ts >= '${from.toISOString()}'
            ORDER BY from_ts`);
    }
    dayAgoISOString() {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        return pastDate.toISOString();
    }
    async query(query) {
        const result = await this.pgClient.query(query);
        return result.rows;
    }
}
exports.DAO = DAO;
//# sourceMappingURL=dao.js.map