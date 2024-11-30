import React from 'react';

import PySandpack from './components/PySanpack';
import { Codes } from 'types/code';
import { PySandpackProvider, usePySandpack } from '@contexts/PySandpackProvider';
import PySandpackPreview from '@components/preview/Preview';
import PySandpackUtil from '@utils/PySandpackUtil';

const DEFAULT_CODE = `# Example code
import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Month': ['January', 'February', 'March', 'April', 'May'],
    'Sales': [100, 150, 200, 130, 170]
}
df = pd.DataFrame(data)

print(df)

plt.figure(figsize=(8, 6))
df.plot(x='Month', y='Sales', kind='line', marker='o', title="Monthly Sales", legend=True)

plt.xlabel("Month")
plt.ylabel("Sales")
plt.grid(True)

plt.show()
`

const DEFAULT_CODES: Codes = { code: DEFAULT_CODE };

function PreviewComponent() {
    const pySandpack = usePySandpack();

    React.useEffect(() => {
        pySandpack.runCodes();
    }, []);

    return (
        <PySandpackPreview />
    )
}

function YourComponent() {
    return (
        <PySandpackProvider codes={DEFAULT_CODES} lang="python">
            <PreviewComponent />
        </PySandpackProvider>
    )
}

const App: React.FC = () => {
    return (
        <>
            <div style={{ position: 'relative', height: '98vh', width: '99vw' }}>
                <PySandpack codes={PySandpackUtil.UrlUtil.searchParam2Codes() ?? DEFAULT_CODES} lang='python' />
            </div>
            {/* <div style={{ position: 'relative', height: '49vh', width: '99vw' }}>
            <YourComponent />
        </div> */}
        </>
    );
};

export default App;
