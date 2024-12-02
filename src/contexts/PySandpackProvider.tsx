import React from "react";

import { Codes, Lang } from "types/code";
import ExecutionProvider from "./ExecutionProvider";
import EngineProvider from "./EngineProvider";
import { Ext2PySpMessageProtocol } from "types/message-protocol";

type Results = Record<string, any>;

type PySandpackCoreProperties = {
    codes: Codes;
    results: Results | undefined;
    error: Error | undefined;
    isRunning: boolean;
    lang: Lang;
}

type PySandpackContextType = PySandpackCoreProperties & {
    isReady: boolean;
    setCodes: (codes: Codes) => void;
    runCodes: (() => void);
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
    onRunCodes?: () => void;
};

function PySandpackProviderCore(props: { children: React.ReactNode; onCodesChange: (codes: Codes) => void; trigger: (codes: Codes, isRunning: boolean) => void; } & PySandpackCoreProperties) {
    const [isReady, setIsReady] = React.useState(false);
    const [codes, setCodes] = React.useState<Codes>(props.codes);

    React.useEffect(() => {
        setIsReady(true);
    }, []);

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent<Ext2PySpMessageProtocol>) => {
            switch (event.data.type) {
                case 'pySandpackCodes':
                    setCodes(event.data.payload.codes);
                    break;
                default:
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    React.useEffect(() => {
        props.onCodesChange(codes);
    }, [codes]);

    const contextValue = React.useMemo<PySandpackContextType>(() => ({
        codes,
        setCodes,
        runCodes: () => props.trigger(codes, props.isRunning),
        results: props.results,
        error: props.error,
        isRunning: props.isRunning,
        isReady,
        lang: props.lang,
    }), [codes, setCodes, props.trigger, props.results, props.error, props.isRunning]);

    return (
        <PySandpackContext.Provider value={contextValue}>
            {props.children}
        </PySandpackContext.Provider>
    )
}

export function PySandpackProvider(props: PySandpackProviderProps) {
    const [codes, setCodes] = React.useState<Codes>(props.codes);
    const [isRunning, setIsRunning] = React.useState(false);
    const [results, setResults] = React.useState<Results>();
    const [error, setError] = React.useState<Error>();

    const finalize = React.useCallback((results: Results | null, error: Error | null) => {
        results && setResults(results);
        error && setError(error);

        (!!error || Object.keys(results ?? {}).length) && setIsRunning(false);
    }, []);

    return (
        <EngineProvider lang={props.lang} onError={setError}>
            {
                engine => (
                    engine ?
                        <ExecutionProvider
                            onStart={() => setIsRunning(true)}
                            onDone={(results) => finalize(results, null)}
                            onError={(error) => finalize(null, error)}
                        >
                            {
                                (trigger) => (
                                    <PySandpackProviderCore
                                        codes={codes}
                                        onCodesChange={setCodes}
                                        error={error}
                                        results={results}
                                        isRunning={isRunning}
                                        trigger={(codes, isRunning) => { trigger(engine, codes, isRunning); props.onRunCodes?.() }}
                                        lang={props.lang}
                                    >
                                        {props.children}
                                    </PySandpackProviderCore>
                                )
                            }
                        </ExecutionProvider> :
                        <PySandpackProviderCore
                            codes={codes}
                            onCodesChange={setCodes}
                            error={undefined}
                            results={undefined}
                            isRunning={false}
                            trigger={() => { console.error('Failed to run code. Engine has not been inited.'); props.onRunCodes?.() }}
                            lang={props.lang}
                        >
                            {props.children}
                        </PySandpackProviderCore>
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
