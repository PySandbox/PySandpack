import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import FlotingBoxLayout from '@components/base/FloatingBoxLayout';
import { PREVIEW_CONTAINER, RUNTIME_ERROR_CONTAINER } from '@metadata/preview';
import CodeRunner from '@components/common/CodeRunner';
import StatusDisplay from '@components/common/StatusDisplay';
import EmptyPreviewContent from './EmptyPreviewContent';
import { PALETTE } from '@metadata/palette';
import PopupButton from '@components/base/PopupButton';

function Errors() {
    const [open, setOpen] = React.useState(false);

    return (
        <PopupButton
            onChange={setOpen}
            buttonProps={{
                children: '⚠',
                color: open ? 'red' : undefined,
                tooltip: 'Errors',
            }}
        >
            <div
                style={{
                    width: '18cm',
                    height: '10cm',
                    overflow: 'scroll',
                    border: `1px solid ${PALETTE.NEUTRAL_GRAY}7e`,
                    backgroundColor: PALETTE.NEUTRAL_GRAY + '7e',
                }}
            >
                <div id={RUNTIME_ERROR_CONTAINER}></div>
            </div>
        </PopupButton>
    )
}

function PreviewController() {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Errors />
            <CodeRunner tooltip='Re-run'>⟳</CodeRunner>
        </div>
    )
}

export default function PySandpackPreview(props: { showSplashScreen?: boolean; }) {
    const pspHook = usePySandpack();

    const [is1st, setIs1st] = React.useState(true);

    // const cleanEelmentById = React.useCallback((id: string) => {
    //     const previewContainer = document.getElementById(id);

    //     if (!previewContainer) return;

    //     previewContainer.innerHTML = '';
    // }, [])

    const parseResult = React.useCallback((result: any) => {
        if (typeof result?.toString === 'function') {
            return result.toString();
        }

        return result;
    }, [])

    React.useEffect(() => {
        if (pspHook.isRunning) setIs1st(false);

        // if (!pspHook.isRunning) return;

        // cleanEelmentById(PREVIEW_CONTAINER);
        // cleanEelmentById(RUNTIME_ERROR_CONTAINER);
    }, [pspHook.isRunning]);

    return (
        <FlotingBoxLayout floatingBox={<PreviewController />}>
            <div>
                {props.showSplashScreen && pspHook.isReady ? <StatusDisplay blockOnCodesRunning /> : <></>}
                <div id={PREVIEW_CONTAINER}>
                    {!props.showSplashScreen ? <></> :
                        ((pspHook.isRunning || !is1st) ? <></> : <EmptyPreviewContent />)}
                </div>
                {
                    Object.entries(pspHook.results ?? {}).map(([key, result]) => {
                        return (
                            <React.Fragment key={key}>
                                <pre>
                                    {parseResult(result)}
                                </pre>
                                <br />
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </FlotingBoxLayout>
    );
}