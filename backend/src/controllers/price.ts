import { Request, Response, NextFunction} from 'express';
import { DAO, PriceRow } from '../dao/dao'
import { Prices } from '@/models/price';

export const last24hPrice = (dao: DAO) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const date = new Date();
        date.setDate(date.getDate() - 1);

        const rows: PriceRow[] = await dao.Prices(date);
        res.json(toModel(rows));
    } catch (error){
        next(error);
    }
}

export const lastWeekPrice = (dao: DAO) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        const date = new Date();
        date.setDate(date.getDate() - 7);

        const rows: PriceRow[] = await dao.Prices(date);
        res.json(toModel(rows));
    } catch (error){
        next(error);
    }
}

const toModel = (rows: PriceRow[]): Prices => {
    const prices: Prices = {
        froms: [],
        vals: []
    }

    rows.forEach(x => {
        prices.froms.push(x.from_ts.toISOString());
        prices.vals.push(x.value);
    })

    return prices;
}