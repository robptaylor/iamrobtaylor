export interface FuelVal {
    fuel: string;
    vals: number[];
}
export interface Generation {
    froms: string[];
    fuels: FuelVal[];
}
