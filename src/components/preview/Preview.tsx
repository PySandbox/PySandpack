import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import FloatingBox from '@components/base-ui/FloatingBox';
import FlotingBoxLayout from '@components/base-ui/FlotingBoxLayout';

function Controller() {
    const pspHook = usePySandpack();

    return (
        <button disabled={!pspHook.isReady} onClick={() => pspHook.runCodes?.()}>
            Run
        </button>
    );
}

export default function PySandpackPreview() {
    const pspHook = usePySandpack();

    return (
        <FlotingBoxLayout floatingBox={<Controller />}>
            <>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />aasd
                {
                    Object.entries(pspHook.results ?? {}).map(([key, result]) => {
                        return (
                            <React.Fragment key={key}>
                                {result}
                                <br />
                            </React.Fragment>
                        )
                    })
                }
            </>
        </FlotingBoxLayout>
    );
}
