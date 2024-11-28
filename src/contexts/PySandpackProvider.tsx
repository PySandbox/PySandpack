import React from "react";

import { Codes, Lang } from "types/code";
import ExecutionProvider from "./ExecutionProvider";
import EngineProvider from "./EngineProvider";

type Results = Record<string, any>;

type PySandpackCoreProperties = {
    codes: Codes;
    runCodes: (() => void);
    results: Results | undefined;
    error: Error | undefined;
    isRunning: boolean;
    lang: Lang;
}

type PySandpackContextType = PySandpackCoreProperties & {
    isReady: boolean;
    setCodes: (codes: Codes) => void;
}

const PySandpackContext = React.createContext<PySandpackContextType>({
    codes: {},
    setCodes: () => { },
    runCodes: () => { },
    results: {},
    error: undefined,
    isReady: false,
    isRunning: false,
    lang: 'python',
});//FIXME: `undefined` initiation not work :(

type PySandpackProviderProps = {
    lang: Lang;
    codes: Codes;
    children: React.ReactNode;
};

function PySandpackProviderCore(props: { children: React.ReactNode; onCodesChange: (codes: Codes) => void } & PySandpackCoreProperties) {
    const [isReady, setIsReady] = React.useState(false);
    const [codes, setCodes] = React.useState<Codes>(props.codes);

    React.useEffect(() => {
        setIsReady(true);
    }, []);

    React.useEffect(() => {
        props.onCodesChange(codes);
    }, [codes]);

    const contextValue = React.useMemo<PySandpackContextType>(() => ({
        codes,
        setCodes,
        runCodes: props.runCodes,
        results: props.results,
        error: props.error,
        isRunning: props.isRunning,
        isReady,
        lang: props.lang,
    }), [codes, setCodes, props.runCodes, props.results, props.error, props.isRunning]);

    return (
        <PySandpackContext.Provider value={contextValue}>
            {props.children}
        </PySandpackContext.Provider>
    )
}

export function PySandpackProvider(props: PySandpackProviderProps) {
    const [codes, setCodes] = React.useState<Codes>(props.codes);
    const [results, setResults] = React.useState<Results>();
    const [error, setError] = React.useState<Error>();

    const finalize = React.useCallback((results: Results | null, error: Error | null) => {
        results && setResults(results);
        error && setError(error);
    }, []);

    return (
        <EngineProvider lang={props.lang} onError={setError}>
            {
                engine => (
                    engine ?
                        <ExecutionProvider
                            engine={engine}
                            codes={codes}
                            onDone={(results) => finalize(results, null)}
                            onError={(error) => finalize(null, error)}
                        >
                            {
                                (trigger, isRunning) => (
                                    <PySandpackProviderCore
                                        codes={codes}
                                        onCodesChange={setCodes}
                                        error={error}
                                        results={results}
                                        isRunning={isRunning}
                                        runCodes={trigger}
                                        lang={props.lang}
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
