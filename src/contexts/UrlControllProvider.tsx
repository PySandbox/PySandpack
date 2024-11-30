import React from 'react';

import LZString from 'lz-string';

import { Codes } from "types/code";

const KEY = 'pySandpackCodes';

export function codes2query(codes: Codes) {
    const str = JSON.stringify(codes);
    const compStr = LZString.compressToEncodedURIComponent(str);

    return compStr;
}

export function query2codes(str: string): Codes {
    const decompStr = LZString.decompressFromEncodedURIComponent(str);
    const codes = JSON.parse(decompStr);

    return codes;
}

export default function UrlControllProvider(props: { codes: Codes }) {
    React.useEffect(() => {
        const handleUrlChange = () => {
            console.log("URL changed:", window.location.href);
        };

        window.addEventListener("popstate", handleUrlChange);
        return () => {
            window.removeEventListener("popstate", handleUrlChange);
        };
    }, []);

    return (<></>)
}