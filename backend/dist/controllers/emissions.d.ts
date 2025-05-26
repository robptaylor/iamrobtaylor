import { Request, Response, NextFunction } from 'express';
import { DAO } from '../dao/dao';
export declare const last24hEmissions: (dao: DAO) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
