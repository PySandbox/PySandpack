import React from 'react';

import type Pyodide from 'pyodide';

import { Engine } from '../../types/engine';

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

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
                            initRuntime: async (codes) => {
                                function extractImports(codes: Record<string, string>) {
                                    const importRegex = /^(?:from\s+(\w+)\s+import\s+|import\s+(\w+))/gm;
                                    const modules = new Set<string>();

                                    for (const code of Object.values(codes)) {
                                        let match;

                                        while ((match = importRegex.exec(code)) !== null) {
                                            modules.add(match[1] || match[2]);
                                        }
                                    }

                                    return Array.from(modules);
                                }

                                const modules = extractImports(codes);

                                for (const module of modules) {
                                    try {
                                        await newEngine.loadPackage(module);
                                    }
                                    catch (e: any) {
                                        props.onError(e);
                                    }
                                }
                            },
                            runCodes: async (codes) => newEngine.runPythonAsync(Object.values(codes)[0] ?? ''),
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
