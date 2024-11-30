import React from 'react';

import PySandpack from './components/PySanpack';
import { Codes } from 'types/code';
import { PySandpackProvider, usePySandpack } from '@contexts/PySandpackProvider';
import PySandpackPreview from '@components/preview/Preview';

const DEFAULT_CODE = `
import pandas as pd
import matplotlib.pyplot as plt

# 데이터프레임 생성
data = {
    'Month': ['January', 'February', 'March', 'April', 'May'],
    'Sales': [100, 150, 200, 130, 170]
}
df = pd.DataFrame(data)

# 데이터프레임 출력 (디버깅용)
print(df)

# 그래프 생성 및 출력
plt.figure(figsize=(8, 6))
df.plot(x='Month', y='Sales', kind='line', marker='o', title="Monthly Sales", legend=True)

# 축 라벨 설정
plt.xlabel("Month")
plt.ylabel("Sales")
plt.grid(True)

# 그래프 보여주기
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
            <PySandpack codes={DEFAULT_CODES} lang='python' />
        </div>
        {/* <div style={{ position: 'relative', height: '49vh', width: '99vw' }}>
            <YourComponent />
        </div> */}
        </>
    );
};

export default App;
