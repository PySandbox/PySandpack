//NOTE: Not used for now. Find the way to send the Ploty graph.
import type Pyodide from 'pyodide';

import { M2WProtocol, W2MProtocol } from 'types/web-workder-protocol';
import PythonEngine from './PythonEngine';

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

//@ts-ignore
importScripts(PYODIDE_CDN_URL);

type Pyodide = Pyodide.PyodideInterface;

let pyodide: Pyodide.PyodideInterface | null = null;

self.onmessage = async (ev: MessageEvent<M2WProtocol>) => {
    const data = ev.data as M2WProtocol;

    if (data.command === 'pysandpack:init') {
        try {
            pyodide = await (self as any).loadPyodide();

            self.postMessage({ status: 'pysandpack:initialized', message: '' } as W2MProtocol);
        }
        catch (error) {
            self.postMessage({ status: 'pysandpack:init-error', message: (error as Error).message } as W2MProtocol);
        }
    }

    if (!pyodide) return;

    switch (data.command) {
        case 'pysandpack:run':
            try {
                const results = await new PythonEngine(pyodide).runCodes(data.codes);

                self.postMessage({ status: 'pysandpack:done', message: results } as W2MProtocol<Record<string, any>>);
            }
            catch (error) {
                self.postMessage({ status: 'pysandpack:runtime-error', message: (error as Error).message } as W2MProtocol);
            }
            break;
        case 'pysandpack:install-dep':
            for (const code of Object.values(data.codes)) {
                await new PythonEngine(pyodide).installDependencies(code);
            }
            break;
        default:
    }
};
