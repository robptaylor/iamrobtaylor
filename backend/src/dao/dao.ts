interface PGClient {
    query(s: string, params?: string[]): any
}

export class DAO {
    pgClient: PGClient

    constructor(pgClient: PGClient) {
        this.pgClient = pgClient;
    }

    public async GenerationPctLastDay(): Promise<GenerationRow[]> {
        return this.query(`
            SELECT DATE_TRUNC('HOUR', from_ts) as from_ts, fuel, AVG(percent) as value
            FROM energy.generation_pct
            WHERE from_ts >= '${this.dayAgoISOString()}' AND from_ts < now()
            GROUP BY DATE_TRUNC('HOUR', from_ts), fuel
            ORDER BY DATE_TRUNC('HOUR', from_ts), fuel`);
    }

    public async GenerationPctLatest(): Promise<GenerationRow[]> {
        return this.query(`
            SELECT from_ts, fuel, percent as value FROM energy.generation_pct
            WHERE from_ts = (SELECT MAX(from_ts) FROM energy.generation_pct WHERE from_ts < now())`)
    }

    public async GenerationGWLastDay(): Promise<GenerationRow[]>{
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
            ORDER BY from_ts, fuel`)
    }

    public async Prices(from: Date): Promise<PriceRow[]> {
        return this.query(`
            SELECT from_ts, price_mwh as value
            FROM energy.elexon_price
            WHERE from_ts >= '${from.toISOString()}'
            ORDER BY from_ts`);
    }

    public async Emissions(from: Date): Promise<EmissionsRow[]> {
        return this.query(`
            SELECT from_ts, intensity_g_per_kwh
            FROM energy.emissions
            WHERE from_ts >= '${from.toISOString()}'
            ORDER BY from_ts`);
    }

    private dayAgoISOString() {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        return pastDate.toISOString();
    }

    private async query(query: string) {
        const result = await this.pgClient.query(query)
        return result.rows
    }
}

export interface GenerationRow {
    from_ts: Date;
    fuel: string;
    value: number;
}

export interface PriceRow {
    from_ts: Date;
    value: number;
}

export interface EmissionsRow {
    from_ts: Date;
    intensity_g_per_kwh: number;
}