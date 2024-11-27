import React from 'react';
import { Codes, Results } from 'types/code';

import { Engine } from "types/engine";

type Props<T> = {
    codes: Record<string, string>;
    engine: Engine;
    onDone?: (outputs: Results<T>) => void;
    onError?: (error: Error) => void;
    children: (trigger: () => void) => React.ReactNode;
}

export default function ExecutionProvider<T>(props: Props<T>) {
    const [isRunning, setIsRunning] = React.useState(false);
    const [output, setOutput] = React.useState<Results<T>>({});
    const [error, setError] = React.useState<Error>();

    React.useEffect(() => {
        error && props.onError?.(error);
    }, [error]);

    React.useEffect(() => {
        props.onDone?.(output);
    }, [output]);

    const runCodes = React.useCallback(async (engine: Engine, codes: Codes) => {
        if (isRunning) return;

        setIsRunning(true);
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
        finally {
            setIsRunning(false);
        }
    }, []);

    return (
        props.children(() => runCodes(props.engine, props.codes))
    )
}
