import type Pyodide from 'pyodide';

import { M2WProtocol, W2MProtocol } from '../../../types/web-workder-protocol';
import CodesRunner from './CodesRunner';

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

importScripts(PYODIDE_CDN_URL);

type Pyodide = Pyodide.PyodideInterface;

let pyodide: Pyodide.PyodideInterface | null = null;

self.onmessage = async (event: MessageEvent<M2WProtocol>) => {
    const { command, codes } = event.data;

    if (command === 'pysandpack:init') {
        try {
            pyodide = await (self as any).loadPyodide();

            self.postMessage({ status: 'pysandpack:initialized', message: '' } as W2MProtocol);
        }
        catch (error) {
            self.postMessage({ status: 'pysandpack:init-error', message: (error as Error).message } as W2MProtocol);
        }
    }

    if (!pyodide) return;

    switch (command) {
        case 'pysandpack:run':
            try {
                const results = await new CodesRunner(pyodide).runPythonFiles(codes);
    
                self.postMessage({ status: 'pysandpack:done', message: results } as W2MProtocol<Record<string, any>>);
            }
            catch (error) {
                self.postMessage({ status: 'pysandpack:runtime-error', message: (error as Error).message } as W2MProtocol);
            }
            break;
        default:
    }
};
