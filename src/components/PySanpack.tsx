import React from 'react';

import Split from "react-split";

import PySandpackEditor from "./editor/Editor";
import PySandpackPreview from './preview/Preview';

export default function PySandpack() {
    const [codes, setCodes] = React.useState<Record<string, string>>();

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Split
                sizes={[50, 30]}
                minSize={100}
                gutterSize={10}
                direction="horizontal"
                className="split"
            >
                <PySandpackEditor onChange={(v) => setCodes(v)} />
                <PySandpackPreview lang="python" codes={codes ?? {}} />
            </Split>
        </div>
    );
}
