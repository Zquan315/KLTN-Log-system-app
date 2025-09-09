import { Response } from 'express';
import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly svc;
    constructor(svc: LogsService);
    list(q?: string, label?: 'attack' | 'benign', from?: string, to?: string, limit?: string, cursor?: string): Promise<{
        items: Record<string, any>[];
        nextCursor: string | null;
    }>;
    exportCsv(res: Response, q?: string, label?: 'attack' | 'benign', from?: string, to?: string, limit?: string, cursor?: string): Promise<void>;
}
