# PySandpack

**PySandpack** is a React library designed to provide a sandbox environment for executing Python code directly in the browser. It is ideal for educational purposes, quick experiments, or running Python scripts without requiring a local Python installation.

## Features

- **Run Python Code in Your Browser**  
  Powered by Pyodide, PySandpack allows users to execute Python scripts in a safe and isolated environment.
  
- **Code Editor with Rich Features**  
  The integrated CodeMirror editor offers syntax highlighting, auto-indentation, and a clean interface for writing Python code.

## Technology Stack

- **[CodeMirror](https://codemirror.net/):** A versatile text editor for the web, providing an intuitive and developer-friendly experience.
- **[Pyodide](https://pyodide.org/):** A Python distribution for the browser, enabling Python code execution using WebAssembly.

## Getting Started

### 1. Using Code/Preview split component
```ts
import PySandpack from "py_sandpack";

<PySandpack codes={{ "main.py": "print('Hello, World!')" }} lang="python" />;
```

### 2. Using Preview only
```ts
import { PySandpackProvider, usePySandpack } from 'py_sandpack';


function PreviewComponent() {
    const pySandpack = usePySandpack();

    React.useEffect(() => {
        pySandpack.runCodes();
    }, []);

    return (
        <PySandpackPreview />
    )
}

function YourComponent() {
    return (
        <PySandpackProvider codes={{ "main.py": "print('Hello,World!')" }} lang="python">
            <PreviewComponent />
        </PySandpackProvider>
    )
}
```