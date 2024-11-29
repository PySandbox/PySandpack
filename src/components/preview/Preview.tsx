import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import FlotingBoxLayout from '@components/base/FloatingBoxLayout';
import { PREVIEW_CONTAINER, RUNTIME_ERROR_CONTAINER } from '@metadata/preview';
import CodeRunner from '@components/common/CodeRunner';
import StatusDisplay from '@components/common/StatusDisplay';
import EmptyPreviewContent from './EmptyPreviewContent';
import RoundedButton from '@components/base/RoundButton';
import { PALLETE } from '@metadata/pallete';

function Errors() {
    const popupRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <RoundedButton color={open ? 'red' : undefined} onClick={() => setOpen(!open)} tooltip='Errors'>⚠</RoundedButton>
            <div
                ref={popupRef}
                style={{
                    position: "absolute",
                    right: open ? 'calc(1.5cm)' : `calc(${popupRef.current?.offsetWidth ?? 0}px + 1.5cm)`,
                    bottom: open ? 'calc(1.5cm)' : `calc(${popupRef.current?.offsetHeight ?? 0}px + 1.5cm)`,
                    display: open ? undefined : 'none',

                }}
            >
                <div style={{ cursor: 'pointer', color: PALLETE.NEUTRAL_GRAY, }} onClick={() => setOpen(false)}>
                    ✖
                </div>
                <div
                    style={{
                        width: '18cm',
                        height: '10cm',
                        overflow: 'scroll',
                        border: `1px solid ${PALLETE.NEUTRAL_GRAY}7e`,
                        backgroundColor: PALLETE.NEUTRAL_GRAY + '40',
                    }}
                >
                    <div id={RUNTIME_ERROR_CONTAINER}></div>
                </div>
            </div>
        </>
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
        <FlotingBoxLayout floatingBox={<PreviewController />}>
            <div>
                <StatusDisplay blockOnCodesRunning />
                <div id={PREVIEW_CONTAINER}><EmptyPreviewContent /></div>
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