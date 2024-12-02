import { PREVIEW_CONTAINER, } from "@metadata/preview";

import * as Pyodide from "pyodide";

import { Engine } from "types/engine";
import { MATPLOT_INIT_CODE, STD_INIT_CODE } from "./PredefinedCodes";

// import "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

const CDN = "https://cdn.jsdelivr.net/";
const PYODIDE_CDN_URL = CDN + "pyodide/v0.26.4/full/pyodide.js";

// const worker = new Worker(new URL("./PythonEngineLoadingWebWorker.ts", import.meta.url))

// worker.postMessage({
//     command: 'pysandpack:init',
//     codes: { }
// } as M2WProtocol);

// worker.addEventListener('message', (ev: MessageEvent<M2WProtocol>) => {
//     console.log(ev.data);
// });

export default class PythonEngine implements Engine<Pyodide.PackageData> {
    constructor(private pyodide: Pyodide.PyodideInterface | null = null) { }

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

    private resolvePyodide(): Pyodide.PyodideInterface {
        if (!this.pyodide) throw new Error('Failed to resolve Pyodide. Call `init()` before use.');

        return this.pyodide;
    }

    private async runCode(code: string) {
        await this.installDependencies(code);

        const result = await this.resolvePyodide().runPython(code);

        return result;
    }

    private setupMplGraphElement() {
        const target = document.getElementById(PREVIEW_CONTAINER);

        //@ts-ignore
        document.pyodideMplTarget = target;
    }

    private async runPredefinedCodes(depsMap: { [fileName: string]: string[] }) {
        await this.runCode(STD_INIT_CODE);

        const depSet = new Set<string>();

        for (const deps of Object.values(depsMap)) {
            for (const dep of deps) {
                depSet.add(dep);
            }
        }

        depSet.has("matplotlib") && await this.runCode(MATPLOT_INIT_CODE);
    }

    private async initPyodideInCommon(): Promise<Pyodide.PyodideInterface> {
        const pyodide = await Pyodide.loadPyodide();

        return pyodide;
    }

    private async getPyodideFromWindow() {
        const loadPyodideInBrowser = (window as any).loadPyodide as typeof Pyodide.loadPyodide;

        if (!loadPyodideInBrowser) throw new Error('`window` object does not contain `loadPyodide`.');

        const pyodide = await loadPyodideInBrowser();

        return pyodide;
    }

    private initPyodideInBrowser() {
        return new Promise<Pyodide.PyodideInterface>(async (resolve, reject) => {
            try {
                //NOTE: For preloaded
                const pyodide = await this.getPyodideFromWindow();

                resolve(pyodide);

                return;
            }
            catch (e) { }

            const script = document.createElement("script");

            script.crossOrigin = CDN;
            script.src = PYODIDE_CDN_URL;
            script.async = true;

            document.body.appendChild(script);

            script.onload = async () => {
                try {
                    const pyodide = await this.getPyodideFromWindow();

                    resolve(pyodide);
                }
                catch (e) {
                    reject(e);
                }
            };
        });
    }

    public async init() {
        const promise = Promise.resolve(this) as Promise<Engine>;

        if (this.pyodide) return promise;

        console.log('Pyodide Loading');

        const isOnWebServer = window.location.protocol === 'http:' || window.location.protocol === 'https:';
        const pyodide = await (isOnWebServer ? this.initPyodideInBrowser() : this.initPyodideInCommon());

        console.log('Pyodide Loaded');

        this.pyodide = pyodide;

        return promise;
    }

    public async installDependencies(code: string) {
        return await this.resolvePyodide().loadPackagesFromImports(code);
    }

    public async runCodes(files: Record<string, string>): Promise<Record<string, any>> {
        const graph = this.buildDependencyGraph(files);
        const executionOrder = this.topologicalSort(graph);
        const results: Record<string, any> = {};

        this.setupMplGraphElement();
        await this.runPredefinedCodes(graph);

        for (const file of executionOrder) {
            const code = files[file];

            const result = code ? await this.runCode(code) : undefined;

            results[file] = result;
        }

        return results;
    }
}
