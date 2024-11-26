import React from 'react';

import PySandpackEditor from "./editor/Editor";
import PySandpackPreview from './preview/Preview';
import { PySandpackProvider } from '@contexts/PySandpackProvider';
import { Codes, Lang } from 'types/code';
import SplitLayout from './base-ui/SplitLayout';

export default function PySandpack(props: { codes: Codes; lang: Lang; }) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <PySandpackProvider codes={props.codes} lang={props.lang}>
                <SplitLayout>
                    <PySandpackEditor />
                    <PySandpackPreview />
                </SplitLayout>
            </PySandpackProvider>
        </div >
    );
}
