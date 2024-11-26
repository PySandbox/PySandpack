import React from 'react';

import PySandpack from './components/PySanpack';
import PySandpackPreview from './components/preview/Preview';

const App: React.FC = () => {
    return (
        <>
            <PySandpack />
            <PySandpackPreview />
        </>
    );
};

export default App;
