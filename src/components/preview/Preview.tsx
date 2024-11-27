import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import FlotingBoxLayout from '@components/base-ui/FlotingBoxLayout';
import { CANVAS, PREVIEW_CONTAINER } from '@metadata/preview';

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
            <div>
                <div id={PREVIEW_CONTAINER}></div>
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
            </div>
        </FlotingBoxLayout>
    );
}
