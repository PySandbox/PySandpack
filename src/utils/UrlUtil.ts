import { CODES_KEY } from '@metadata/message-protocol-enum';
import LZString from 'lz-string';

import { Codes } from "types/code";

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

    const codesString = paramMap.get(CODES_KEY);
    const codes = codesString ? decompCodes(codesString) : undefined;

    return codes;
}

export function codes2SearchParam(codes: Codes) {
    const query = compCodes(codes);
    const params = new URLSearchParams(window.location.search);

    params.set(CODES_KEY, query ?? '');

    const str = params.toString();

    return str;
}
