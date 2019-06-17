const ansiRegex = require('ansi-regex');

const ProgressBar = require('../src');
const colors = require('../src/colors');
const TestStream = require('./TestStream');

describe('progress bar ansi characters', () => {
  it('returns 0% green bars', async () => {
    const stream = new TestStream();
    const pBar = new ProgressBar({ stream });
    const barChar = '\u2588';
    pBar.run('', 0, 100);
    const output = stream.read().toString();
    const bar = `${colors.white}${barChar}`.repeat(30);
    const expectedOutput = `${bar}${colors.reset}`;
    expect(output.match(ansiRegex())).toEqual(
      expectedOutput.match(ansiRegex())
    );
  });

  it('returns 50% green bars', async () => {
    const stream = new TestStream();
    const pBar = new ProgressBar({ stream });
    const barChar = '\u2588';
    pBar.run('', 50, 100);
    const output = stream.read().toString();
    const greenBar = `${colors.green}${barChar}`.repeat(15);
    const whiteBar = `${colors.white}${barChar}`.repeat(15);
    const expectedOutput = `${greenBar}${whiteBar}${colors.reset}`;
    expect(output.match(ansiRegex())).toEqual(
      expectedOutput.match(ansiRegex())
    );
  });

  it('returns 100% green bars', async () => {
    const stream = new TestStream();
    const pBar = new ProgressBar({ stream });
    const barChar = '\u2588';
    pBar.run('', 23, 23);
    const output = stream.read().toString();
    const greenBar = `${colors.green}${barChar}`.repeat(30);
    const expectedOutput = `${greenBar}${colors.reset}`;
    expect(output.match(ansiRegex())).toEqual(
      expectedOutput.match(ansiRegex())
    );
  });
});
