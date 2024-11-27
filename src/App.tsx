import React from 'react';

import PySandpack from './components/PySanpack';
import { Codes } from 'types/code';

const App: React.FC = () => {
    const DEFAULT_CODES: Codes = { code: "print('Hello, World!')" };

    return (
        <div style={{ height: '95vh', width: '99vw' }}>
            <PySandpack codes={DEFAULT_CODES} lang='python' />
        </div>
    );
};

export default App;
