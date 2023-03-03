/* eslint-disable no-restricted-globals */

self.onmessage = (e: MessageEvent<number>) => {
  const numberOfSecondsToBlock = e.data;
  console.info(
    `Web Worker received request to run for ${numberOfSecondsToBlock} seconds`
  );
  const start = Date.now();
  while (Date.now() - start < numberOfSecondsToBlock * 1000) {
    // do nothing, we just want to wait
  }

  self.postMessage("done");
};

export {};
