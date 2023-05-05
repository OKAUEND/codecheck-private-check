import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import style from './App.module.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <section className={`${style.root}`}>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className={`${style.logo}`} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className={`${style.logo} ${style.react}`}
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={`${style.cart}`}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={`${style.readTheDocs}`}>
        Click on the Vite and React logos to learn more
      </p>
    </section>
  );
}

export default App;
