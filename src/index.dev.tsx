import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import PySandpack from './';

const DEFAULT_CODE = `import pandas as pd
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

const App = () => {
  return (
    <div style={{height: "98vh",}} >
      <PySandpack codes={{ code: DEFAULT_CODE }} lang='python' />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
