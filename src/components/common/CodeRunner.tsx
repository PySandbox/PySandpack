import React from 'react';

import { usePySandpack } from '@contexts/PySandpackProvider';
import RoundedButton from '@components/base/RoundButton';
import Rotation from '@components/base/Rotation';
import Logo from './Logo';

export default function CodeRunner(props: { tooltip: string; children: React.ReactNode; }) {
    const pspHook = usePySandpack();

    if (!pspHook.isReady || pspHook.isRunning) return (
        <Rotation>
            <div style={{ width: "1cm", height: "1cm" }}>
                <Logo />
            </div>
        </Rotation>
    )

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
