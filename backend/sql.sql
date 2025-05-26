CREATE schema energy;

CREATE TYPE energy.fuel AS ENUM ('biomass', 'coal', 'imports', 'gas', 'nuclear', 'other', 'hydro', 'solar', 'wind');

CREATE TABLE energy.generation_pct (
    id bigserial primary key,
    from_ts timestamp,
    to_ts timestamp,
    fuel energy.fuel,
    percent double precision,
    UNIQUE (from_ts, to_ts, fuel)
);

CREATE INDEX energy_generation_pct_from ON energy.generation_pct (from_ts);

CREATE TYPE energy.fuel_elexon AS ENUM (
 'BIOMASS',
 'CCGT',
 'COAL',
 'INTELEC',
 'INTEW',
 'INTFR',
 'INTGRNL',
 'INTIFA2',
 'INTIRL',
 'INTNED',
 'INTNEM',
 'INTNSL',
 'INTVKL',
 'NPSHYD',
 'NUCLEAR',
 'OCGT',
 'OIL',
 'OTHER',
 'PS',
 'WIND'
);

CREATE TABLE energy.generation_elexon (
    id bigserial primary key,
    from_ts timestamp,
    to_ts timestamp,
    fuel energy.fuel_elexon,
    mw double precision,
    UNIQUE (from_ts, to_ts, fuel)
)

CREATE INDEX energy_generation_elexon_from ON energy.generation_elexon (from_ts);

CREATE TABLE energy.elexon_price (
    id bigserial primary key,
    from_ts timestamp,
    price_mwh double precision,
    UNIQUE (from_ts)
)

CREATE TABLE energy.emissions (
    id bigserial primary key,
    from_ts timestamp,
    to_ts timestamp,
    intensity_g_per_kwh double precision,
    UNIQUE (from_ts, to_ts)
)
