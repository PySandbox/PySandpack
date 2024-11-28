import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import RoundedButton from '@components/base/RoundButton';

export default function CodeRunner(props: { tooltip: string; children: React.ReactNode; }) {
    const pspHook = usePySandpack();

    return (
        <RoundedButton
            disabled={!pspHook.isReady || pspHook.isRunning}
            tooltip={props.tooltip}
            onClick={() => pspHook.runCodes?.()}
        >
            {props.children}
        </RoundedButton>
    );
}
