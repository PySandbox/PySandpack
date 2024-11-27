import Pyodide from "pyodide";
import { type PyodideInterface } from "pyodide";

import { Engine } from "types/engine";

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

// const worker = new Worker(new URL("./PythonEngineLoadingWebWorker.ts", import.meta.url))

// worker.postMessage({
//     command: 'pysandpack:init',
//     codes: { }
// } as M2WProtocol);

// worker.addEventListener('message', (ev: MessageEvent<M2WProtocol>) => {
//     console.log(ev.data);
// });

export default class PythonEngine implements Engine<Pyodide.PackageData> {
    constructor(private pyodide: PyodideInterface | null = null) { }

    private extractImports(script: string): string[] {
        const importRegex = /import\s+([a-zA-Z_][a-zA-Z0-9_]*)|from\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+import/g;
        const imports: string[] = [];

        let match: RegExpExecArray | null;

        while ((match = importRegex.exec(script)) !== null) {
            if (match[1]) {
                imports.push(match[1]);
            } else if (match[2]) {
                imports.push(match[2]);
            }
        }
        return imports;
    }

    private buildDependencyGraph(files: { [fileName: string]: string }): { [fileName: string]: string[] } {
        const graph: { [fileName: string]: string[] } = {};

        for (const file in files) {
            const script = files[file];
            graph[file] = this.extractImports(script);
        }

        return graph;
    }

    private topologicalSort(graph: { [fileName: string]: string[] }): string[] {
        const visited = new Set<string>();
        const order: string[] = [];

        function visit(file: string): void {
            if (!visited.has(file)) {
                visited.add(file);

                graph[file]?.forEach(visit);
                order.push(file);
            }
        }

        Object.keys(graph).forEach(visit);

        return order;
    }

    private resolvePyodide(): PyodideInterface {
        if (!this.pyodide) throw new Error('Failed to resolve Pyodide. Call `init()` before use.');

        return this.pyodide;
    }

    public init() {
        if (this.pyodide) return Promise.resolve(this) as Promise<Engine>;

        return new Promise<Engine>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = PYODIDE_CDN_URL;
            script.async = true;

            document.body.appendChild(script);

            script.onload = async () => {
                try {
                    const loadPyodide = (window as any).loadPyodide as typeof Pyodide.loadPyodide;

                    if (!loadPyodide) throw new Error('`window` object does not contain `loadPyodide`.');

                    const pyodide = await loadPyodide();

                    this.pyodide = pyodide;

                    resolve(this);
                }
                catch (err) {
                    reject(err);
                }
            };
        });
    }

    public async installDependencies(code: string) {
        return await this.resolvePyodide().loadPackagesFromImports(code);
    }

    public async runCodes(files: Record<string, string>): Promise<Record<string, any>> {
        const graph = this.buildDependencyGraph(files);
        const executionOrder = this.topologicalSort(graph);
        const results: Record<string, any> = {};

        for (const file of executionOrder) {
            const code = files[file];

            if (!code) continue;

            await this.installDependencies(code);

            const result = await this.resolvePyodide().runPython(code);

            results[file] = result;
        }

        return results;
    }
}
