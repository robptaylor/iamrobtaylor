
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

// export async function GetPriceLast24h(){
//     const response = await fetch('/api/price/last24h');
//     return await response.json();
// }

export interface FuelVal{
    fuel: string;
    vals: number[];
}

export interface Generation{
    froms: string[];
    fuels: FuelVal[];
}

export default GetGenerationGWLast24h;