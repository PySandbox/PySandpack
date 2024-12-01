import React from 'react';
import { Codes, Results } from 'types/code';

import { Engine } from "types/engine";

type Props<T> = {
    // codes: Record<string, string>;
    // engine: Engine;
    onStart?: () => void;
    onDone?: (outputs: Results<T>) => void;
    onError?: (error: Error) => void;
    children: (trigger: (engine: Engine, codes: Codes, isRunning: boolean) => void) => React.ReactNode;
}

export default function ExecutionProvider<T>(props: Props<T>) {
    const [output, setOutput] = React.useState<Results<T>>({});
    const [error, setError] = React.useState<Error>();

    React.useEffect(() => {
        error && props.onError?.(error);
    }, [error]);

    React.useEffect(() => {
        props.onDone?.(output);
    }, [output]);

    const runCodes = React.useCallback(async (engine: Engine, codes: Codes, isRunning: boolean) => {
        if (isRunning) return;

        props.onStart?.();
        setError(undefined);
        setOutput({});

        try {
            const results = await engine.runCodes(codes);

            setOutput(results);
        }
        catch (err: any) {
            console.error(err);
            setError(err);
        }
    }, []);

    return (
        props.children((engine, codes, isRunning) => runCodes(engine, codes, isRunning))
    )
}
