import { Client } from 'pg';
import express, { Router} from 'express';

import { last24hPct, latestPct, last24hGW } from './controllers/generation';
import { last24hPrice } from './controllers/price';
import { last24hEmissions } from './controllers/emissions';
import { DAO as ReadOnlyDAO} from './dao/dao';
import { DAO as ScraperDAO } from './scrapers/dao';
import { Scraper } from './scrapers/scraper';

function setupPGClient(): Client{
  const client = new Client({
    user: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
  });
  
  client.connect();
  return client;
}

function setupScraper(client: Client){
  const scraperDAO = new ScraperDAO(client);
  const sc = new Scraper(scraperDAO);

  const fifteenMins = 15 * 60 * 1_000;
  // const fifteenMins = 5_000;
  sc.start(fifteenMins);
}

function setupAPI(client: Client){
  const readOnlyDAO = new ReadOnlyDAO(client)
  
  const app = express();
  app.use(express.json())

  const router = Router();
  router.get('/generation_pct/last24h', last24hPct(readOnlyDAO));
  router.get('/generation_pct/latest', latestPct(readOnlyDAO));
  router.get('/generation_gw/last24h', last24hGW(readOnlyDAO));
  router.get('/price/last24h', last24hPrice(readOnlyDAO));
  router.get('/emissions/last24h', last24hEmissions(readOnlyDAO));

  app.use('/api', router)

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
  });
}

const client = setupPGClient()
setupScraper(client);
setupAPI(client);