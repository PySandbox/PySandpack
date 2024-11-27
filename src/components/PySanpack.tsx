import React from 'react';

import Split from "react-split";

import PySandpackEditor from "./editor/Editor";
import PySandpackPreview from './preview/Preview';
import { PySandpackProvider } from '@contexts/PySandpackProvider';

export default function PySandpack() {
    const [codes, setCodes] = React.useState<Record<string, string>>({});

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <PySandpackProvider codes={codes} lang={'python'}>
                <Split
                    sizes={[50, 50]}
                    minSize={100}
                    gutterSize={10}
                    direction="horizontal"
                    className="split"
                >
                    <PySandpackEditor onChange={(v) => setCodes(v)} />
                    <PySandpackPreview />
                </Split>
            </PySandpackProvider>
        </div>
    );
}
