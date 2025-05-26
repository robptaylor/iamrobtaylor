import { Request, Response, NextFunction} from 'express';
import { DAO, EmissionsRow } from '../dao/dao'
import { Emissions } from '@/models/emissions';

export const last24hEmissions = (dao: DAO) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const rows: EmissionsRow[] = await dao.EmissionsLastDay();
        res.json(toModel(rows));
    } catch (error){
        next(error);
    }
}

const toModel = (rows: EmissionsRow[]): Emissions => {
    const emissions: Emissions = {
        froms: [],
        vals: []
    }

    rows.forEach(x => {
        emissions.froms.push(x.from_ts.toISOString());
        emissions.vals.push(x.intensity_g_per_kwh);
    })

    return emissions;
}