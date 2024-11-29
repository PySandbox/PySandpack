import React from 'react';

import CodeMirror, { EditorView, ReactCodeMirrorProps } from '@uiw/react-codemirror';

import { usePySandpack } from '@contexts/PySandpackProvider';
import EditorExtensionFactory from '@contexts/editor-engine/EditorExtensionFactory';
import FloatingBoxLayout from '@components/base/FloatingBoxLayout';
import CodeRunner from '@components/common/CodeRunner';

export type PySandpackEditorProps = ReactCodeMirrorProps;

export default function PySandpackEditor(props: PySandpackEditorProps) {
    const pySpHook = usePySandpack();

    return (
        <FloatingBoxLayout floatingBox={<CodeRunner tooltip='Run'>▶</CodeRunner>}>
            <CodeMirror
                value={Object.values(pySpHook.codes)[0]}
                lang={pySpHook.lang}
                width='100%'
                maxWidth='100%'
                extensions={[...new EditorExtensionFactory().create(pySpHook.lang), EditorView.lineWrapping]}
                onChange={(code) => {
                    pySpHook.setCodes({ code });
                }}
                style={{
                    height: '100%',
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'auto',
                }}
                {...props}
            />
        </FloatingBoxLayout>
    )
}