import React from 'react';

import type Pyodide from 'pyodide';

import { Engine } from '../../types/engine';
import { M2WProtocol } from '../../types/web-workder-protocol';
import CodesRunner from './engine/CodesRunner';

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";




const worker = new Worker(new URL("./engine/EngineWorker.ts", import.meta.url))

worker.postMessage({
    command: 'pysandpack:init',
    codes: { }
} as M2WProtocol);

worker.addEventListener('message', (ev: MessageEvent<M2WProtocol>) => {
    console.log(ev.data);
});



export default function EngineProvider(props: { children: (pyodide: Engine | null) => React.ReactNode; onLoad?: (engine: Engine) => void; onError: (e: Error) => void; }) {
    const [engine, setEngine] = React.useState<Engine | null>(null);

    React.useEffect(() => {
        engine && props.onLoad?.(engine);
    }, [engine]);

    React.useEffect(() => {
        const loadEngine = async () => {
            try {
                const script = document.createElement("script");
                script.src = PYODIDE_CDN_URL;
                script.async = true;

                document.body.appendChild(script);

                script.onload = async () => {
                    try {
                        const loadPyodide = (window as any).loadPyodide as typeof Pyodide.loadPyodide;

                        if (!loadPyodide) throw new Error('`window` object does not contain `loadPyodide`.');

                        const newEngine = await loadPyodide();

                        setEngine({
                            runCodes: async (codes) => {
                                return new CodesRunner(newEngine).runPythonFiles(codes);
                            }
                        });
                    }
                    catch (err) {
                        setEngine(null);

                        props.onError(err as Error);
                    }
                };
            }
            catch (err) {
                setEngine(null);

                props.onError(err as Error);
            }
        };

        loadEngine();
    }, []);

    return props.children(engine);
}
