import { Request, Response, NextFunction } from 'express';
import { DAO } from '../dao/dao';
export declare const last24hPrice: (dao: DAO) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const lastWeekPrice: (dao: DAO) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
