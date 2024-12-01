import { Codes } from "./code";

type CodesKey = 'pySandpackCodes';

type BaseProtocol<T, P> = {
    type: T;
    payload: P;
}

type CodesProtocol = BaseProtocol<CodesKey, { codes: Codes }>;

type ReadyProtocol = BaseProtocol<'pySandpackReady', undefined>;

export type Ext2PySpMessageProtocol = CodesProtocol /* | AnyOthers */;

export type PySp2ExtMessageProtocol = ReadyProtocol /* | AnyOthers */;
