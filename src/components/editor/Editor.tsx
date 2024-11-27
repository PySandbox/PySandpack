import React from 'react';

import CodeMirror from '@uiw/react-codemirror';

import { usePySandpack } from '@contexts/PySandpackProvider';
import { Codes } from 'types/code';

export default function PySandpackEditor(props: { onChange?: (codes: Codes) => void }) {
    const pySpHook = usePySandpack();

    return (
        <CodeMirror
            width='100%'
            height='100%'
            onChange={(code) => {
                pySpHook.setCodes({ code });
                props.onChange?.({ code });
            }}
            style={{ height: '100%', width: '100%', }}
        />
    )
}