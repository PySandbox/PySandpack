import React from 'react';

import CodeMirror from '@uiw/react-codemirror';

import { usePySandpack } from '@contexts/PySandpackProvider';
import { Codes } from 'types/code';
import EditorExtensionFactory from '@contexts/editor-engine/EditorExtensionFactory';

export default function PySandpackEditor(props: { onChange?: (codes: Codes) => void; }) {
    const pySpHook = usePySandpack();

    return (
        <CodeMirror
            value={Object.values(pySpHook.codes)[0]}
            lang={pySpHook.lang}
            extensions={new EditorExtensionFactory().create(pySpHook.lang)}
            onChange={(code) => {
                pySpHook.setCodes({ code });
                props.onChange?.({ code });
            }}
            style={{ height: '100%', width: '100%', }}
        />
    )
}