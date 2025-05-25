import { Client } from "pg";
import { Data, ElexonGeneration, ElexonPrice } from "./model";
export declare class DAO {
    private pgClient;
    constructor(pgClient: Client);
    upsertCarbonIntensityGeneration(g: Data): Promise<import("pg").QueryResult<any>>;
    upsertElexonGeneration(g: ElexonGeneration[]): Promise<import("pg").QueryResult<any>>;
    upsertElexonPrices(g: ElexonPrice[]): Promise<import("pg").QueryResult<any>>;
}
