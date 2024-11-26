export type M2WProtocol = {
    command: 'pysandpack:init' | 'pysandpack:run';
    codes: Record<string, string>;
}

export type W2MProtocol<T = string> = {
    status:  'pysandpack:initialized' | 'pysandpack:init-error' | 'pysandpack:done' | 'pysandpack:runtime-error';
    message: T;
}
