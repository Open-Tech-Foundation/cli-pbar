const ProgressBar = require('../src');

let complete = 0;
const progressBar = new ProgressBar();
progressBar.run('Downloading', complete, 150);

const intervalID = setInterval(() => {
  complete += 5;
  progressBar.run('Downloading', complete, 150);
  if (complete === 150) {
    clearInterval(intervalID);
    progressBar.run('Download completed', complete, 150);
    progressBar.stop();
  }
}, 100);
