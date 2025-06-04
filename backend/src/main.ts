import { Client } from 'pg';
import express, { Router} from 'express';

import { last24hPct, latestPct, last24hGW } from './controllers/generation';
import { last24hPrice, lastWeekPrice } from './controllers/price';
import { last24hEmissions, lastWeekEmissions } from './controllers/emissions';
import { DAO as ReadOnlyDAO} from './dao/dao';
import { DAO as ScraperDAO } from './scrapers/dao';
import { Scraper } from './scrapers/scraper';

function setupPGClient(): Client{
  console.log(`POSTGRES_URL=${process.env.POSTGRES_URL}`);
  
  const client = new Client({
    user: 'postgres',
    password: 'password',
    host: process.env.POSTGRES_URL,
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

  const apiRouter = Router();
  apiRouter.get('/generation_pct/last24h', last24hPct(readOnlyDAO));
  apiRouter.get('/generation_pct/latest', latestPct(readOnlyDAO));
  apiRouter.get('/generation_gw/last24h', last24hGW(readOnlyDAO));
  apiRouter.get('/price/last24h', last24hPrice(readOnlyDAO));
  apiRouter.get('/price/lastWeek', lastWeekPrice(readOnlyDAO));
  apiRouter.get('/emissions/last24h', last24hEmissions(readOnlyDAO));
  apiRouter.get('/emissions/lastWeek', lastWeekEmissions(readOnlyDAO));

  console.log(`dir: ${__dirname}`);

  app.use('/api', apiRouter);
  app.use(express.static('public'));
  app.get('/{*splat}', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
  });
}

const client = setupPGClient()
setupScraper(client);
setupAPI(client);