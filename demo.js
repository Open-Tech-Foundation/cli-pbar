import { sleep } from '@open-tech-world/es-utils';

import { ProgressBar } from './lib/index.esm.js';

function runProgress(
  total,
  prefix,
  suffix,
  color,
  finalPrefix,
  finalSuffix,
  width
) {
  return new Promise((resolve) => {
    let complete = 0;
    let currentSuffix = Array.isArray(suffix) ? suffix.shift() : suffix;
    let currentColor = Array.isArray(color) ? color.shift() : color;
    const progressBar = new ProgressBar({
      prefix,
      suffix: currentSuffix,
      color: currentColor,
      width: width,
    });
    progressBar.run({ value: complete, total });
    const intervalID = setInterval(() => {
      complete += 5;
      if (complete === total) {
        progressBar.run({
          value: complete,
          total,
          prefix: finalPrefix,
          suffix: finalSuffix,
        });
        clearInterval(intervalID);
        console.log();
        resolve();
      } else {
        currentSuffix =
          Array.isArray(suffix) && complete % 25 === 0
            ? suffix.shift()
            : currentSuffix;
        currentColor =
          Array.isArray(color) && complete % 30 === 0
            ? color.shift()
            : currentColor;
        progressBar.run({
          value: complete,
          total,
          suffix: currentSuffix,
          color: currentColor,
        });
      }
    }, 100);
  });
}

(async () => {
  await runProgress(50);
  await runProgress(
    100,
    'Downloading',
    undefined,
    undefined,
    'Download completed!'
  );
  await runProgress(
    100,
    'Installing',
    ['Google Chrome', 'Firefox', 'Microsoft Edge', 'Developer Tools'],
    undefined,
    '',
    'Installation Done!',
    20
  );
  await runProgress(50, 'Custom bar color', '', 'blue');
  await runProgress(90, 'Multiple colors', '', ['red', 'yellow', 'green']);

  const p1 = new ProgressBar({
    autoClear: true,
    prefix: 'This will be auto cleared',
  });
  p1.run({ value: 0, total: 50 });
  await sleep(500);
  p1.run({ value: 25, total: 50 });
  await sleep(500);
  p1.run({ value: 45, total: 50 });
  await sleep(500);
  p1.run({ value: 50, total: 50 });
})();
