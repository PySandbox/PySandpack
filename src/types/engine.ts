export interface Engine<D = any, R = any> {
    init: () => Promise<Engine>;
    installDependencies: (code: string) => Promise<Array<D>>;
    runCodes: (codes: Record<string, string>) => Promise<R>;
};
