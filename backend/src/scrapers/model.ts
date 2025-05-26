export interface CarbonIntensityGeneration {
    data: Data
}

export interface CarbonIntensityGenerations {
    data: Data[]
}

export interface Data {
    from: Date
    to: Date
    generationmix: GenerationMix[]
}

interface GenerationMix {
    fuel: string
    perc: number
}

export interface ElexonGeneration{
    startTime: Date
    publishTime: Date
    fuelType: string
    generation: number
}

export interface ElexonPrices{
    data: ElexonPrice[]
}

export interface ElexonPrice{
    startTime: Date
    price: number
}

export interface Emissions {
    data: EmissionsData[]
}

export interface EmissionsData{
    from: Date
    to: Date
    intensity: Intensity
}

export interface Intensity {
    forecast: number
    actual: number | null
    index: string
}