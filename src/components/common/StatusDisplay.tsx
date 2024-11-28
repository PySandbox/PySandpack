import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';

function Ready() {
    return (
        <>
            Init
        </>
    )
}

function Running() {
    return (
        <>
            Running
        </>
    )
}

export default function StatusDisplay(props: { children?: React.ReactNode; }) {
    const pspHook = usePySandpack();

    if (!pspHook.isReady) return <Ready />

    if (pspHook.isRunning) return <Running></Running>

    return props.children ?? <></>
}
