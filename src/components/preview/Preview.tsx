import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import FlotingBoxLayout from '@components/base/FloatingBoxLayout';
import { PREVIEW_CONTAINER, RUNTIME_ERROR_CONTAINER } from '@metadata/preview';
import CodeRunner from '@components/common/CodeRunner';
import StatusDisplay from '@components/common/StatusDisplay';
import EmptyPreviewContent from './EmptyPreviewContent';

export default function PySandpackPreview() {
    const pspHook = usePySandpack();

    const cleanEelmentById = React.useCallback((id: string) => {
        const previewContainer = document.getElementById(id);

        if (!previewContainer) return;

        previewContainer.innerHTML = '';
    }, [])

    React.useEffect(() => {
        if (!pspHook.isRunning) return;

        cleanEelmentById(PREVIEW_CONTAINER);
        cleanEelmentById(RUNTIME_ERROR_CONTAINER);
    }, [pspHook.isRunning]);

    return (
        <FlotingBoxLayout floatingBox={<CodeRunner tooltip='Re-run'>⟳</CodeRunner>}>
            <div>
                <StatusDisplay blockOnCodesRunning />
                <div id={PREVIEW_CONTAINER}><EmptyPreviewContent /></div>
                {/* <div id={RUNTIME_ERROR_CONTAINER}></div> */}
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
