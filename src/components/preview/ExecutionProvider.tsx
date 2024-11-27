import React from 'react';

import { Engine } from "types/engine";

type Props<T> = {
    codes: Record<string, string>;
    engine: Engine;
    onDone: (outputs: Record<string, T>) => void;
    onError: (error: Error) => void;
    children: (trigger: () => void) => React.ReactNode;
}

export default function ExecutionProvider<T>(props: Props<T>) {
    const [isRunning, setIsRunning] = React.useState(false);
    const [output, setOutput] = React.useState<Record<string, any>>({});
    const [error, setError] = React.useState<Error>();

    React.useEffect(() => {
        error && props.onError(error);
    }, [error]);

    React.useEffect(() => {
        props.onDone(output);
    }, [output]);

    const runCodes = async (engine: Engine, codes: Record<string, string>) => {
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
    };

    return (
        props.children(() => runCodes(props.engine, props.codes))
    )
}
