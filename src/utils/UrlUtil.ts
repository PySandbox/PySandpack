import LZString from 'lz-string';

import { Codes } from "types/code";

const KEY = 'pySandpackCodes' as const;

function compCodes(codes: Codes) {
    try {
        const str = JSON.stringify(codes);
        const compStr = LZString.compressToEncodedURIComponent(str);

        return compStr;
    }
    catch (e) {
        console.warn(e);

        return undefined;
    }
}

function decompCodes(str: string): Codes | undefined {
    try {
        const decompStr = LZString.decompressFromEncodedURIComponent(str);
        const codes = JSON.parse(decompStr);

        return codes;
    }
    catch (e) {
        console.warn(e);

        return undefined;
    }
}

export function searchParam2Codes() {
    const params = new URLSearchParams(window.location.search);
    const paramMap = new Map<string, string>();

    params.forEach((value, key) => paramMap.set(key, value));

    const codesString = paramMap.get(KEY);
    const codes = codesString ? decompCodes(codesString) : undefined;

    return codes;
}

export function codes2SearchParam(codes: Codes) {
    const query = compCodes(codes);
    const params = new URLSearchParams(window.location.search);

    params.set(KEY, query ?? '');

    const str = params.toString();

    return str;
}
