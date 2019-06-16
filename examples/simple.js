const ProgressBar = require('../src');

let complete = 0;
const progressBar = new ProgressBar();
progressBar.run('Downloading', complete, 5000);

const intervalID = setInterval(() => {
  complete += 500;
  progressBar.run('Downloading', complete, 5000);
  if (complete === 5000) {
    clearInterval(intervalID);
    progressBar.run('Download completed', complete, 5000);
    progressBar.stop();
  }
}, 500);
