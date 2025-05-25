import json
import psycopg2
from datetime import datetime, timedelta
import schedule
import requests
import logging
import time
import asyncio

log = logging.getLogger(__name__)

def setup_logging(log):
    log.setLevel(logging.DEBUG)

    # create console handler and set level to debug
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)

    # create formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # add formatter to ch
    ch.setFormatter(formatter)

    # add ch to logger
    log.addHandler(ch)

setup_logging(log)

conn = psycopg2.connect(database = "postgres",
                        user = "postgres",
                        password = "password",
                        host = "127.0.0.1",
                        port = "5432")

def upsert_generation_pct():
    log.info('getting generation')
    r: requests.Response = requests.get('https://api.carbonintensity.org.uk/generation')

    if r.status_code != 200:
        log.warning('failed response code: ', r.status_code)
        return
    
    log.info(f'got response: {r.status_code}: {r.text}')
    
    k = r.json()

    from_ts = k['data']['from']
    to_ts = k['data']['to']

    vals = []
    for fuel_gen in k['data']['generationmix']:
        fuel = fuel_gen['fuel']
        perc = fuel_gen['perc']
        vals.append(f"('{from_ts}', '{to_ts}', '{fuel}', {perc})")
    
    query = 'INSERT INTO energy.generation (from_ts, to_ts, fuel, percent) VALUES ' + \
        ','.join(vals) + ' ON CONFLICT DO NOTHING'
    
    log.info(query)

    with conn.cursor() as cur:
        cur.execute(query)
    conn.commit()

def upsert_generation_elexon(from_ts: str, to_ts: str):
    log.info('getting generation mw from {from_ts} to {to_ts}')

    r = requests.get(f'https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELINST/stream?publishDateTimeFrom={from_ts}&publishDateTimeTo={to_ts}')
    
    if r.status_code != 200:
        log.warning('failed response code: ', r.status_code)
        return
    
    log.info(f'got response: {r.status_code}: {r.text}')
    resp_json = r.json()

    vals = []

    for d in resp_json:
        vals.append(f"('{d['startTime']}', '{d['publishTime']}', '{d['fuelType']}', {d['generation']})")
        
    query = 'INSERT INTO energy.generation_elexon (from_ts, to_ts, fuel, mw) VALUES ' + \
        ','.join(vals) + ' ON CONFLICT DO NOTHING'
    
    log.info(query)

    with conn.cursor() as cur:
        cur.execute(query)
    conn.commit()
        
        

def upsert_bulk_generation(from_ts: str, to_ts: str):
    log.info(f'getting generation % from {from_ts} to {to_ts}')
    
    r: requests.Response = requests.get(f'https://api.carbonintensity.org.uk/generation/{from_ts}/{to_ts}')

    if r.status_code != 200:
        log.warning('failed response code: ', r.status_code)
        return
    
    log.info(f'got response: {r.status_code}: {r.text}')
    
    k = r.json()

    data = k['data']
    vals = []

    for d in data:
        from_ts = d['from']
        to_ts = d['to']

        for fuel_gen in d['generationmix']:
            fuel = fuel_gen['fuel']
            perc = fuel_gen['perc']
            s = f"('{from_ts}', '{to_ts}', '{fuel}', {perc})"
            vals.append(s)
            log.info(f'appended: {s}')
    
    query = 'INSERT INTO energy.generation (from_ts, to_ts, fuel, percent) VALUES ' + \
        ','.join(vals) + ' ON CONFLICT DO NOTHING'
    
    log.info(query)

    with conn.cursor() as cur:
        cur.execute(query)
    conn.commit()
    


# schedule.every(10).minutes.do(upsert_generation)

# async def check_schedule():
#     while True:
#         schedule.run_pending()
#         asyncio.sleep(1)

# asyncio.run(check_schedule)


# upsert_generation()
from_ts = datetime.now() - timedelta(days=1)
to_ts = datetime.now()

upsert_bulk_generation(from_ts.isoformat(), to_ts.isoformat())
upsert_generation_elexon(from_ts.isoformat(), to_ts.isoformat())
