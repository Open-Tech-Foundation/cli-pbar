const colors = require('./colors');
const { percentage, percentageVal } = require('./math');

class ProgressBar {
  constructor(options = {}) {
    this.width = 30;
    this.stream = options.stream || process.stderr;
    this.barChar = options.barChar || '\u2588';
  }

  render(progress) {
    this.stream.cursorTo(0);
    this.stream.write(progress);
    this.stream.clearLine(1);
  }

  bar(percent) {
    const completedWidth = percentageVal(this.width, percent);
    const remainingWidth = this.width - completedWidth;
    const completedBar = `${colors.green}${this.barChar}`.repeat(
      completedWidth
    );
    const remainingBar = `${colors.white}${this.barChar}`.repeat(
      remainingWidth
    );
    return completedBar + remainingBar;
  }

  run(action = '', curVal = 0, totalVal = 0, statusText = '') {
    const percent = percentage(curVal, totalVal);
    const barString = this.bar(percent);
    this.render(
      `${action} ${barString} ${colors.reset} ${percent}% ${statusText}`
    );
  }

  stop(clear = false) {
    if (clear) {
      this.stream.cursorTo(0);
      this.stream.clearLine(1);
    } else {
      this.stream.write('\n');
    }
  }
}

module.exports = ProgressBar;
