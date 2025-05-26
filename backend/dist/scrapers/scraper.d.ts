import { DAO } from './dao';
export declare class Scraper {
    private timeout;
    private dao;
    constructor(dao: DAO);
    start(delay: number): Promise<void>;
    stop(): void;
    private getCarbonIntensityGeneration;
    private getCarbonIntensityGenerations;
    private getElexonGeneration;
    private getElexonPrice;
    private scrape;
}
