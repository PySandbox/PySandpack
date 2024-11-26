export type Engine = {
    initRuntime: (codes: Record<string, string>) => Promise<void>;
    runCodes: (codes: Record<string, string>) => Promise<any>;
};
