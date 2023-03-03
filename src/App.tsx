import { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [pageLoadedAt] = useState(Date.now());
  const [areWorkersSupported] = useState(typeof Worker !== "undefined");
  const [operationFinishedAt, setOperationFinishedAt] = useState<
    Date | undefined
  >();
  const worker: Worker = useMemo(
    () => new Worker(new URL("./worker.ts", import.meta.url)),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const runBlockingOperation = (numberOfSecondsToBlock: number) => {
    console.info("Starting blocking operation...");
    const start = Date.now();
    while (Date.now() - start < numberOfSecondsToBlock * 1000) {
      // do nothing, we just want to block the main thread
    }
    setOperationFinishedAt(new Date());
    console.info("Blocking operation finished!");
  };

  const runWebWorkerOperation = (numberOfSecondsToBlock: number) => {
    console.info("Starting web worker operation...");
    worker.postMessage(numberOfSecondsToBlock);
    worker.onmessage = () => {
      setOperationFinishedAt(new Date());
      console.info("Web worker operation finished!");
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {areWorkersSupported ? (
        <div className="worker-supported">Web Workers are supported!</div>
      ) : (
        <div className="worker-not-supported">
          Web Workers are not supported!
        </div>
      )}
      <div className="info-area">
        <p>This page was loaded at {new Date(pageLoadedAt).toLocaleString()}</p>
        <p>
          Running time: {Math.floor((Date.now() - pageLoadedAt) / 1000)}{" "}
          seconds.
        </p>
        <h3>Counter: {count}</h3>
        <p>Every second, 1 will be added to the counter.</p>
        <p>
          Long running operations block the main thread, which will cause the
          counter and running time to become out of sync.
        </p>
        <p>
          You will also notice, that dom events are blocked (try mousing over
          the buttons while a long operation is running), which means the whole
          page becomes unresponsive.
        </p>
        <p>
          Last operation finished at:{" "}
          {operationFinishedAt === undefined
            ? "Never"
            : new Date(operationFinishedAt).toLocaleString()}
        </p>
        <hr />
        <h3>Blocking Operations</h3>
        <button className="btn" onClick={() => runBlockingOperation(10)}>
          Long Running Operation (10s)
        </button>
        <button className="btn" onClick={() => runBlockingOperation(60)}>
          Long Running Operation (60s)
        </button>
        <h3>Non-blocking Operations (Web Workers)</h3>
        <button className="btn" onClick={() => runWebWorkerOperation(10)}>
          Long Running Operation (10s)
        </button>
        <button className="btn" onClick={() => runWebWorkerOperation(60)}>
          Long Running Operation (60s)
        </button>
      </div>
    </div>
  );
}

export default App;
