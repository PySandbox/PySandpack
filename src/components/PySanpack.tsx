import React from 'react';

import PySandpackEditor, { PySandpackEditorProps } from "./editor/Editor";
import PySandpackPreview from './preview/Preview';
import { PySandpackProvider } from '@contexts/PySandpackProvider';
import { Codes, Lang } from 'types/code';
import SplitLayout from './base/SplitLayout';
import StatusDisplay from './common/StatusDisplay';

export default function PySandpack(props: { codes: Codes; lang: Lang; editorProps?: PySandpackEditorProps }) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <PySandpackProvider codes={props.codes} lang={props.lang}>
                <StatusDisplay>
                    <SplitLayout>
                        <PySandpackEditor {...props.editorProps} />
                        <PySandpackPreview />
                    </SplitLayout>
                </StatusDisplay>
            </PySandpackProvider>
        </div >
    );
}