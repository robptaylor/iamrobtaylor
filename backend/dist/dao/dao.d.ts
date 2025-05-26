interface PGClient {
    query(s: string, params?: string[]): any;
}
export declare class DAO {
    pgClient: PGClient;
    constructor(pgClient: PGClient);
    GenerationPctLastDay(): Promise<GenerationRow[]>;
    GenerationPctLatest(): Promise<GenerationRow[]>;
    GenerationGWLastDay(): Promise<GenerationRow[]>;
    PriceLastDay(): Promise<PriceRow[]>;
    EmissionsLastDay(): Promise<EmissionsRow[]>;
    private dayAgoISOString;
    private query;
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
export {};
