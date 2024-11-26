export type Engine = {
    runCodes: (codes: Record<string, string>) => Promise<any>;
};
