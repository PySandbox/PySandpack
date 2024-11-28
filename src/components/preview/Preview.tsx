import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import FlotingBoxLayout from '@components/base/FloatingBoxLayout';
import { PREVIEW_CONTAINER } from '@metadata/preview';
import CodeRunner from '@components/common/CodeRunner';
import StatusDisplay from '@components/common/StatusDisplay';

export default function PySandpackPreview() {
    const pspHook = usePySandpack();

    React.useEffect(() => {
        if (!pspHook.isRunning) return;

        const previewContainer = document.getElementById(PREVIEW_CONTAINER);

        if (!previewContainer) return;

        previewContainer.innerHTML = '';
    }, [pspHook.isRunning]);

    return (
        <FlotingBoxLayout floatingBox={<CodeRunner tooltip='Re-run'>⟳</CodeRunner>}>
            <div>
                <StatusDisplay />
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
