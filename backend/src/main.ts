import { Client } from 'pg';
import express, { Router, Express} from 'express';

import { last24hPct, latestPct, last24hGW } from './controllers/generation';
import { last24hPrice, lastWeekPrice } from './controllers/price';
import { last24hEmissions, lastWeekEmissions } from './controllers/emissions';
import { DAO as ReadOnlyDAO} from './dao/dao';
import { DAO as ScraperDAO } from './scrapers/dao';
import { Scraper } from './scrapers/scraper';
import { createServer } from 'http';
import { createServer as createSecureServer} from 'https';
import { readFileSync } from 'fs';

function setupPGClient(): Client{
  console.log(`POSTGRES_URL=${process.env.POSTGRES_URL}`);
  console.log(`POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD}`);
  
  const client = new Client({
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
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

const setupApp = (app: Express, dao: ReadOnlyDAO) => {
  app.use(express.json())

  const apiRouter = Router();
  apiRouter.get('/generation_pct/last24h', last24hPct(dao));
  apiRouter.get('/generation_pct/latest', latestPct(dao));
  apiRouter.get('/generation_gw/last24h', last24hGW(dao));
  apiRouter.get('/price/last24h', last24hPrice(dao));
  apiRouter.get('/price/lastWeek', lastWeekPrice(dao));
  apiRouter.get('/emissions/last24h', last24hEmissions(dao));
  apiRouter.get('/emissions/lastWeek', lastWeekEmissions(dao));

  console.log(`dir: ${__dirname}`);

  app.use('/api', apiRouter);
  app.use(express.static('public'));
  app.get('/{*splat}', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
  });
}

function setupAPI(client: Client){
  const readOnlyDAO = new ReadOnlyDAO(client)

  const app = express();
  setupApp(app, readOnlyDAO);

  createServer(app).listen(80, () => {
    console.log(`listening on port 80`);
  })

  var appSecure = express();
  setupApp(appSecure, readOnlyDAO);

  var options = {
    key: readFileSync('certs/privkey1.pem'),
    cert: readFileSync('certs/fullchain1.pem'),
  };

  createSecureServer(options, appSecure).listen(443, function(){
      console.log('HTTPS listening on port 443');
  });
}

const client = setupPGClient()
setupScraper(client);
setupAPI(client);