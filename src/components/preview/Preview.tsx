import React from 'react';

import ExecutionProvider from './ExecutionProvider';
import EngineProvider from './EngineProvider';

export default function PySandpackPreview(props: { codes: Record<string, string> }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRunning, setIsRunning] = React.useState(false);
    const [output, setOutput] = React.useState<string>('');
    const [error, setError] = React.useState<Error>();

    return (
        <div>
            <>{output}</>
            {/* These providers should be the pare of context provider */}
            <EngineProvider onError={setError}>
                {
                    (engine) => (
                        engine ?
                            <ExecutionProvider engine={engine} codes={props.codes} onDone={setOutput} onError={setError}>
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
                            <></>
                    )
                }
            </EngineProvider >
        </div>
    )
};
