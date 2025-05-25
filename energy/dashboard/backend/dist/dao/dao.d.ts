interface PGClient {
    query(s: string, params?: string[]): any;
}
export declare class DAO {
    pgClient: PGClient;
    constructor(pgClient: PGClient);
    GenerationPctLastDay(): Promise<any>;
    GenerationPctLatest(): Promise<any>;
    GenerationGWLastDay(): Promise<any>;
    PriceLastDay(): Promise<any>;
    private dayAgoISOString;
    private query;
}
export {};
