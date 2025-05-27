"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importStar(require("express"));
const generation_1 = require("./controllers/generation");
const price_1 = require("./controllers/price");
const emissions_1 = require("./controllers/emissions");
const dao_1 = require("./dao/dao");
const dao_2 = require("./scrapers/dao");
const scraper_1 = require("./scrapers/scraper");
function setupPGClient() {
    const client = new pg_1.Client({
        user: 'postgres',
        password: 'password',
        host: '127.0.0.1',
        port: 5432,
        database: 'postgres',
    });
    client.connect();
    return client;
}
function setupScraper(client) {
    const scraperDAO = new dao_2.DAO(client);
    const sc = new scraper_1.Scraper(scraperDAO);
    const fifteenMins = 15 * 60 * 1000;
    sc.start(fifteenMins);
}
function setupAPI(client) {
    const readOnlyDAO = new dao_1.DAO(client);
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const router = (0, express_1.Router)();
    router.get('/generation_pct/last24h', (0, generation_1.last24hPct)(readOnlyDAO));
    router.get('/generation_pct/latest', (0, generation_1.latestPct)(readOnlyDAO));
    router.get('/generation_gw/last24h', (0, generation_1.last24hGW)(readOnlyDAO));
    router.get('/price/last24h', (0, price_1.last24hPrice)(readOnlyDAO));
    router.get('/price/lastWeek', (0, price_1.lastWeekPrice)(readOnlyDAO));
    router.get('/emissions/last24h', (0, emissions_1.last24hEmissions)(readOnlyDAO));
    router.get('/emissions/lastWeek', (0, emissions_1.lastWeekEmissions)(readOnlyDAO));
    app.use('/api', router);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("Server Listening on PORT:", PORT);
    });
}
const client = setupPGClient();
setupScraper(client);
setupAPI(client);
//# sourceMappingURL=main.js.map