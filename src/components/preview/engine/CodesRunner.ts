import { PyodideInterface } from "pyodide";

export default class CodesRunner {
    constructor(private pyodide: PyodideInterface) { }

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


    public async runPythonFiles(files: Record<string, string>): Promise<Record<string, any>> {
        const graph = this.buildDependencyGraph(files);
        const executionOrder = this.topologicalSort(graph);
        const results: Record<string, any> = {};

        for (const file of executionOrder) {
            const script = files[file];

            if (!script) continue;

            await this.pyodide.loadPackagesFromImports(script);

            const result = await this.pyodide.runPython(script);

            results[file] = result;
        }

        return results;
    }
}
