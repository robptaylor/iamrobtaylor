"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraper = void 0;
class Scraper {
    timeout;
    dao;
    constructor(dao) {
        this.dao = dao;
    }
    async start(delay) {
        this.scrape();
        this.timeout = setInterval(() => this.scrape(), delay);
    }
    stop() {
        clearInterval(this.timeout);
    }
    async getCarbonIntensityGeneration() {
        const resp = await fetch('https://api.carbonintensity.org.uk/generation');
        return resp.json();
    }
    async getCarbonIntensityGenerations(from, to) {
        const fromStr = getDateString(from);
        const toStr = getDateString(to);
        const u = `https://api.carbonintensity.org.uk/generation/${fromStr}/${toStr}`;
        console.log(u);
        const resp = await fetch(u);
        return resp.json();
    }
    async getElexonGeneration(from, to) {
        const fromStr = getDateString(from);
        const toStr = getDateString(to);
        const u = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELINST/stream?publishDateTimeFrom=${fromStr}&publishDateTimeTo=${toStr}`;
        console.log(`getting: ${u}`);
        const resp = await fetch(u);
        return resp.json();
    }
    async getElexonPrice(from, to) {
        const fromStr = getDateString(from);
        const toStr = getDateString(to);
        const u = `https://data.elexon.co.uk/bmrs/api/v1/balancing/pricing/market-index?from=${fromStr}&to=${toStr}&dataProviders=APXMIDP`;
        console.log(`getting: ${u}`);
        const resp = await fetch(u);
        return resp.json();
    }
    async scrape() {
        try {
            console.log(`scraping...`);
            const [from, to] = nowAndTomorrow();
            const cig = await this.getCarbonIntensityGeneration();
            const elexonGeneration = await this.getElexonGeneration(from, to);
            const elexonPrices = await this.getElexonPrice(from, to);
            await this.dao.upsertCarbonIntensityGeneration(cig.data);
            await this.dao.upsertElexonGeneration(elexonGeneration);
            await this.dao.upsertElexonPrices(elexonPrices.data);
            console.log(`done scraping`);
        }
        catch (err) {
            console.error(`failed to scrape: ${err}`);
        }
    }
}
exports.Scraper = Scraper;
function nowAndTomorrow() {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 1);
    return [from, to];
}
function getDateString(d) {
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}
//# sourceMappingURL=scraper.js.map