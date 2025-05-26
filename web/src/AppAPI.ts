
export async function GetGenerationPctLast24h(): Promise<Generation>{
    const response = await fetch('/api/generation_pct/last24h');
    return await response.json();
}

export async function GetGenerationPctLatest(): Promise<Generation>{
    const response = await fetch('/api/generation_pct/latest');
    return await response.json();
}

export async function GetGenerationGWLast24h(): Promise<Generation>{
    const response = await fetch('/api/generation_gw/last24h');
    return await response.json();
}

export async function GetPriceLast24h(): Promise<Prices>{
    const response = await fetch('/api/price/last24h');
    return await response.json();
}

export async function GetEmissionsLast24h(): Promise<Prices>{
    const response = await fetch('/api/emissions/last24h');
    return await response.json();
}

export interface FuelVal{
    fuel: string;
    vals: number[];
}

export interface Generation{
    froms: string[];
    fuels: FuelVal[];
}

export interface Prices{
    froms: string[];
    vals: number[];
}

export interface Emissions{
    froms: string[];
    vals: number[];
}

export default GetGenerationGWLast24h;