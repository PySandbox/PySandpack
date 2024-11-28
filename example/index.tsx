import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PySandpack from '../src';

const App = () => {
  return (
    <div>
      <PySandpack codes={{ }} lang='python' />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
