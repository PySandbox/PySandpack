import React from 'react';

import CodeMirror from '@uiw/react-codemirror';

export default function PySandpackEditor(props: { onChange: (codes: Record<string, string>) => void }) {
    return (
        <CodeMirror
            width='100%'
            height='100%'
            onChange={(code) => { props.onChange({ code }) }}
            style={{ height: '100%', width: '100%', }}
        />
    )
}