import React from 'react';

import ExecutionProvider from './ExecutionProvider';
import EngineProvider from './EngineProvider';

export default function PySandpackPreview(props: { codes: Record<string, string> }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRunning, setIsRunning] = React.useState(false);
    const [outputs, setOutputs] = React.useState<Record<string, any>>({});
    const [error, setError] = React.useState<Error>();

    return (
        <div>
            <>
            {
                Object.entries(outputs).map(([key, output]) => {
                    return (
                        <React.Fragment key={key}>
                            {output}
                            <br />
                        </React.Fragment>
                    )
                })
            }
            </>
            {/* These providers should be the pare of context provider */}
            <EngineProvider onError={setError}>
                {
                    (engine) => (
                        engine ?
                            <ExecutionProvider engine={engine} codes={props.codes} onDone={setOutputs} onError={setError}>
                                {
                                    trigger => (
                                        <button
                                            onClick={() => trigger()}
                                        >
                                            코드 실행
                                        </button>
                                    )
                                }
                            </ExecutionProvider> :
                            <>Loading...</>
                    )
                }
            </EngineProvider >
        </div>
    )
};
