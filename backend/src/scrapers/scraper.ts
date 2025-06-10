import { 
    CarbonIntensityGeneration, 
    CarbonIntensityGenerations,
    ElexonGeneration,
    ElexonPrices,
    Emissions
 } from './model'
import { DAO } from './dao'

export class Scraper {
    private timeout: NodeJS.Timeout;
    private dao: DAO

    constructor(dao: DAO){
        this.dao = dao;
    }

    public async start(delay: number){
        const [from, to] = nowAndTomorrow();
        const cig = await this.getCarbonIntensityGenerations(from, to);

        const now = new Date();
        cig.data.map(x => this.dao.upsertCarbonIntensityGeneration(x))

        this.scrape();
        this.timeout = setInterval(() => this.scrape(), delay);
    }

    public stop(){
        clearInterval(this.timeout);
    }

    private async getCarbonIntensityGenerations(from, to: Date): Promise<CarbonIntensityGenerations> {
        const fromStr = getDateString(from);
        const toStr = getDateString(to);

        const u = `https://api.carbonintensity.org.uk/generation/${fromStr}/${toStr}`;

        console.log(u);

        const resp = await fetch(u);
        return resp.json();
    }

    private async getElexonGeneration(from, to: Date): Promise<ElexonGeneration[]>{
        const fromStr = getDateString(from);
        const toStr = getDateString(to);

        const u = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELINST/stream?publishDateTimeFrom=${fromStr}&publishDateTimeTo=${toStr}`;

        console.log(`getting: ${u}`);
        const resp = await fetch(u);
        return resp.json();
    }

    private async getElexonPrice(from, to: Date): Promise<ElexonPrices>{
        const fromStr = getDateString(from);
        const toStr = getDateString(to);

        const u = `https://data.elexon.co.uk/bmrs/api/v1/balancing/pricing/market-index?from=${fromStr}&to=${toStr}&dataProviders=APXMIDP`;

        console.log(`getting: ${u}`);
        const resp = await fetch(u);
        return resp.json();
    }

    private async getEmissions(date: Date): Promise<Emissions>{
        const u = `https://api.carbonintensity.org.uk/intensity/${getDateString(date)}/pt24h`;

        console.log(`getting: ${u}`);
        const resp = await fetch(u);
        return resp.json();
    }

    private async scrape(){
        try{
            console.log(`scraping...`);
            const [from, to] = nowAndTomorrow();

            const cig = await this.getCarbonIntensityGenerations(from, to);
            const elexonGeneration = await this.getElexonGeneration(from, to);
            const elexonPrices = await this.getElexonPrice(from, to);
            const emissions = await this.getEmissions(to);

            const now = new Date();

            // they seem to return data for the future (predicted?) so filter that out
            await Promise.all(cig.data.map(x => this.dao.upsertCarbonIntensityGeneration(x)))
            
            await this.dao.upsertElexonGeneration(elexonGeneration);
            await this.dao.upsertElexonPrices(elexonPrices.data);
            await this.dao.upsertEmissions(emissions.data);
            console.log(`done scraping`);
        } catch (err){
            console.error(`failed to scrape: ${err}`);
        }
    }
}

function nowAndTomorrow(): [Date, Date]{
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 1);
    return [from, to];
}

function getDateString(d: Date): string {
    const month = `${d.getMonth()+1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}