import { Client } from "pg";
import { Data, ElexonGeneration, ElexonPrice, Emissions, EmissionsData } from "./model";

export class DAO {
    private pgClient: Client

    constructor(pgClient: Client){
        this.pgClient = pgClient;
    }

    public async upsertCarbonIntensityGeneration(g: Data){
        const rows = g.generationmix.map(v => `('${g.from}', '${g.to}', '${v.fuel}', ${v.perc})`);

        const query = `INSERT INTO energy.generation (from_ts, to_ts, fuel, percent)
        VALUES ${rows.join(',')} ON CONFLICT DO NOTHING`;

        return this.pgClient.query(query)
    }

    public upsertElexonGeneration(g: ElexonGeneration[]){
        const rows = g.map(v => `('${v.startTime}', '${v.publishTime}', '${v.fuelType}', ${v.generation})`);
        
        const query = `INSERT INTO energy.generation_elexon (from_ts, to_ts, fuel, mw)
        VALUES ${rows.join(',')} ON CONFLICT DO NOTHING`;

        console.log(query);

        return this.pgClient.query(query)
    }

    public upsertElexonPrices(g: ElexonPrice[]){
        const rows = g.map(v => `('${v.startTime}', ${v.price})`);
        
        const query = `INSERT INTO energy.elexon_price (from_ts, price_mwh)
        VALUES ${rows.join(',')} ON CONFLICT DO NOTHING`;

        console.log(query);

        return this.pgClient.query(query)
    }

    public upsertEmissions(g: EmissionsData[]){
        const rows = g.filter(x => x.intensity?.actual !== null).map(v => `('${v.from}', '${v.to}', '${v.intensity.actual}')`);
        
        const query = `INSERT INTO energy.emissions (from_ts, to_ts, intensity_g_per_kwh)
        VALUES ${rows.join(',')} ON CONFLICT DO NOTHING`;

        console.log(query);

        return this.pgClient.query(query)
    }
}