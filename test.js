import { ProgressBar } from './lib/index.esm.js';

console.log('This is some text');

let complete = 0;
const progressBar = new ProgressBar({ prefix: 'Downloading' });
progressBar.run({ value: complete, total: 150 });

const intervalID = setInterval(() => {
  complete += 5;
  if (complete === 150) {
    progressBar.run({ value: complete, total: 150, prefix: 'Downloaded' });
    clearInterval(intervalID);
    console.log('After text');
    progressBar.run({ value: complete, total: 200, prefix: 'Downloading' });
  } else {
    progressBar.run({ value: complete, total: 150 });
  }
}, 50);
