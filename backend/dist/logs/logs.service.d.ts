export declare class LogsService {
    private doc;
    private table;
    constructor();
    list(params: {
        q?: string;
        label?: 'attack' | 'benign';
        from?: number;
        to?: number;
        limit?: number;
        cursor?: string;
    }): Promise<{
        items: Record<string, any>[];
        nextCursor: string | null;
    }>;
}
