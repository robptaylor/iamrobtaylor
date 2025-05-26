import { Request, Response, NextFunction } from 'express';
import { DAO } from '../dao/dao';
export declare const last24hPct: (dao: DAO) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const latestPct: (dao: DAO) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const last24hGW: (dao: DAO) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
