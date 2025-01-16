import React from 'react';

import CodeMirror, { EditorView, ReactCodeMirrorProps } from '@uiw/react-codemirror';

import { usePySandpack } from '@contexts/PySandpackProvider';
import EditorExtensionFactory from '@contexts/editor-engine/EditorExtensionFactory';
import FloatingBoxLayout from '@components/base/FloatingBoxLayout';
import CodeRunner from '@components/common/CodeRunner';
import { PALETTE } from '@metadata/palette';
import PopupButton from '@components/base/PopupButton';
import PySandpackUtil from '@utils/PySandpackUtil';
import Button from '@components/base/Button';

type CommonProps = {
    hideRunner?: boolean;
    hidePySandbox?: boolean;
};

export type PySandpackEditorProps = ReactCodeMirrorProps & CommonProps;

function Share() {
    const HOMEPAGE = 'https://pysandbox.github.io/dist/?';
    const MAX = 2000;//NOTE: De facto URL limitation
    const pspHook = usePySandpack();

    const [open, setOpen] = React.useState(false);
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        const newLink = HOMEPAGE + PySandpackUtil.UrlUtil.codes2SearchParam(pspHook.codes);

        setLink(newLink);
    }, [pspHook.codes]);

    return (
        <PopupButton
            onChange={setOpen}
            buttonProps={{
                children: '📄',
                color: open ? PALETTE.BLUE : undefined,
                tooltip: 'Share via PySandbox',
            }}
        >
            <div
                style={{
                    width: '10cm',
                    border: `1px solid ${PALETTE.BLUE}`,
                    padding: 10,
                    gap: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}
            >
                <>
                    <div>You can check your code and its execution result on PySandbox with the link below:</div>
                    <textarea rows={10} style={{ resize: 'none', }} value={link} readOnly />
                    <div style={{ display: 'flex', gap: 5, }}>
                        <Button color={PALETTE.BLUE} onClick={() => navigator.clipboard.writeText(link)}>📋 Copy</Button>
                        <Button color={PALETTE.BLUE} onClick={() => window.open(link, '_blank')}>📂 Open</Button>
                    </div>
                    {
                        link.length > MAX ?
                            <div style={{ color: PALETTE.YELLOW, fontSize: '0.8em' }}>
                                ⚠ The generated URL exceeds {MAX} characters due to the length of the code. It may not work correctly.
                            </div> :
                            <></>
                    }
                </>
            </div>
        </PopupButton >
    )
}

function EditorController(props: CommonProps) {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            {props.hidePySandbox ? <></> : <Share />}
            {props.hideRunner ? <></> : <CodeRunner tooltip='Run'>▶</CodeRunner>}
        </div>
    )
}

export default function PySandpackEditor(props: PySandpackEditorProps) {
    const pySpHook = usePySandpack();

    const handleShiftEnter = React.useCallback((e: React.KeyboardEvent) => {
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();

            !pySpHook.isRunning && pySpHook.runCodes();
        }
    }, [pySpHook.isRunning, pySpHook.codes, pySpHook.runCodes]);

    return (
        <FloatingBoxLayout floatingBox={<EditorController {...props} />}>
            <CodeMirror
                value={Object.values(pySpHook.codes)[0]}
                lang={pySpHook.lang}
                width='100%'
                maxWidth='100%'
                style={{
                    height: '100%',
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'auto',
                }}
                {...props}
                extensions={[...(props.extensions ?? []), ...new EditorExtensionFactory().create(pySpHook.lang), EditorView.lineWrapping]}
                // onKeyDown={handleShiftEnter}
                onKeyDownCapture={(e) => {
                    props.onKeyDownCapture?.(e);

                    handleShiftEnter(e);
                }}
                // onKeyUpCapture={handleShiftEnter}
                // onKeyUp={handleShiftEnter}
                onChange={(code, viewUpdate) => {
                    props.onChange?.(code, viewUpdate);
                    pySpHook.setCodes({ code });
                }}
            />
        </FloatingBoxLayout>
    )
}