import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import LoadingOverlay from '@components/base/LoadingOverlay';
import Logo from '@components/common/Logo';
import Rotation from '@components/base/Rotation';

function RuntimeLoading() {
    return (
        <LoadingOverlay description='Loading...'>
            <Rotation>
                <div style={{ width: "5rem", height: "5rem" }}>
                    <Logo />
                </div>
            </Rotation>
        </LoadingOverlay>
    )
}

function CodesRunning() {
    return (
        <LoadingOverlay description='Running...'>
            <Rotation>
                <div style={{ width: "5rem", height: "5rem" }}>
                    <Logo />
                </div>
            </Rotation>
        </LoadingOverlay>
    )
}

export default function StatusDisplay(props: { children?: React.ReactNode; blockOnCodesRunning?: boolean }) {
    const pspHook = usePySandpack();

    if (!pspHook.isReady) return <RuntimeLoading />

    if (pspHook.isRunning && props.blockOnCodesRunning) return <CodesRunning />

    return props.children ? <>{props.children}</> : <></>;
}
