import React from "react";

import { Lang } from "types/language";
import ExecutionProvider from "./ExecutionProvider";
import EngineProvider from "./EngineProvider";

type Results = Record<string, any>;

type PySandpackCoreProperties = {
    codes: Record<string, string>;
    runCodes: (() => void);
    results: Results | undefined;
    error: Error | undefined;
    isRunning: boolean;
}

type PySandpackContextType = PySandpackCoreProperties & {
    isReady: boolean;
    setCodes: (codes: Record<string, string>) => void;
}

const PySandpackContext = React.createContext<PySandpackContextType>({
    codes: {},
    setCodes: () => { },
    runCodes: () => { },
    results: {},
    error: undefined,
    isReady: false,
    isRunning: false,
});

type PySandpackProviderProps = {
    lang: Lang;
    codes: Record<string, string>;
    children: React.ReactNode;
};

function PySandpackProviderCore(props: { children: React.ReactNode; } & PySandpackCoreProperties) {
    const [isReady, setIsReady] = React.useState(false);
    const [codes, setCodes] = React.useState<Record<string, string>>(props.codes);

    React.useEffect(() => {
        setIsReady(true);
    }, []);

    const contextValue = React.useMemo<PySandpackContextType>(() => ({
        codes: props.codes,
        setCodes,
        runCodes: props.runCodes,
        results: props.results,
        error: props.error,
        isRunning: props.isRunning,
        isReady,
    }), [codes, setCodes, props.runCodes, props.results, props.error, props.isRunning]);

    return (
        <PySandpackContext.Provider value={contextValue}>
            {props.children}
        </PySandpackContext.Provider>
    )
}

export function PySandpackProvider(props: PySandpackProviderProps) {
    const [results, setResults] = React.useState<Results>();
    const [error, setError] = React.useState<Error>();
    const [isRunning, setIsRunning] = React.useState<boolean>(false);

    const finalize = React.useCallback((results: Results | null, error: Error | null) => {
        results && setResults(results);
        error && setError(error);

        setIsRunning(false);
    }, []);

    return (
        <EngineProvider lang={props.lang} onError={setError}>
            {
                engine => (
                    engine ?
                        <ExecutionProvider
                            engine={engine}
                            codes={props.codes}
                            onDone={(results) => finalize(results, null)}
                            onError={(error) => finalize(null, error)}
                        >
                            {
                                (trigger) => (
                                    <PySandpackProviderCore
                                        codes={props.codes}
                                        error={error}
                                        results={results}
                                        isRunning={isRunning}
                                        runCodes={trigger}
                                    >
                                        {props.children}
                                    </PySandpackProviderCore>
                                )
                            }
                        </ExecutionProvider> :
                        <>
                            {props.children}
                        </>
                )
            }

        </EngineProvider>
    );
};

export const usePySandpack = () => {
    const context = React.useContext(PySandpackContext);

    if (!context) {
        throw new Error("usePySandpack must be used within a PySandpackProvider");
    }

    return context;
};
