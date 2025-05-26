import { Request, Response, NextFunction} from 'express';
import { DAO, GenerationRow } from '../dao/dao'
import { FuelVal, Generation } from '../models/generation';

export const last24hPct = (dao: DAO) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const rows: GenerationRow[] = await dao.GenerationPctLastDay();
        res.json(toGenerationModel(rows));
    } catch (error){
        next(error);
    }
}

export const latestPct = (dao: DAO) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const rows: GenerationRow[] = await dao.GenerationPctLastDay();
        res.json(toGenerationModel(rows));
    } catch (error){
        next(error);
    }
}

export const last24hGW = (dao: DAO) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const rows: GenerationRow[] = await dao.GenerationGWLastDay();
        res.json(toGenerationModel(rows));
    } catch (error){
        next(error);
    }
}

const toGenerationModel = (rows: GenerationRow[]): Generation => {
    const g: Generation = {
        froms: [],
        fuels: []
    }

    const fuels = new Map<string, FuelVal>();

    rows.forEach(gr => {
        const newFromTS = !g.froms || g.froms[g.froms.length-1] != gr.from_ts.toISOString();
        if (newFromTS){
            g.froms.push(gr.from_ts.toISOString())
        }

        let fuelVal: FuelVal = fuels.get(gr.fuel);
        if (!fuelVal){
            fuelVal = {
                fuel: gr.fuel,
                vals: [],
            };
            fuels.set(gr.fuel, fuelVal);
        }

        fuelVal.vals.push(gr.value)
    });

    fuels.forEach(v => {
        g.fuels.push(v);
    })
    return g;
}


