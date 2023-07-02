import { PassThrough } from 'stream';
import { style } from '@opentf/cli-styles';
import { ProgressBar } from '../src/index.ts';
import {
  DEFAULT_BAR_CHAR,
  MEDIUM_BAR_CHAR,
  SMALL_BAR_CHAR,
} from '../src/constants.ts';

function getStream(isTTY = true) {
  const stream = new PassThrough();
  stream.clearLine = () => true;
  stream.cursorTo = () => true;
  stream.moveCursor = () => true;
  stream.isTTY = isTTY;

  return stream;
}

async function getOutput(stream) {
  const output = [];

  return new Promise((resolve) => {
    stream.on('data', (data) => {
      output.push(data.toString());
    });

    stream.on('end', () => {
      resolve(output);
    });
  });
}

async function run(cb, options = {}, isTTY = true) {
  const stream = getStream(isTTY);
  const outputPromise = getOutput(stream);
  const progress = new ProgressBar(Object.assign(options, { stream: stream }));
  await cb(progress);
  stream.end();

  return await outputPromise;
}

function getBars(complete = 0, percent = 0, opt = {}) {
  const options = {
    width: 30,
    color: 'g',
    bgColor: 'gr',
    size: 'DEFAULT',
    prefix: '',
    suffix: '',
    ...opt,
  };
  let barChar;
  if (options.size === 'DEFAULT') {
    barChar = DEFAULT_BAR_CHAR;
  } else if (options.size === 'MEDIUM') {
    barChar = MEDIUM_BAR_CHAR;
  } else {
    barChar = SMALL_BAR_CHAR;
  }
  return (
    options.prefix +
    ' ' +
    style(`$${options.color}.bol{${barChar}}`).repeat(complete) +
    style(`$${options.bgColor}.dim{${barChar}}`).repeat(
      options.width - complete
    ) +
    ` ${percent}%` +
    ' ' +
    options.suffix
  );
}

describe('Multi Progress Bar', () => {
  it('renders single bar created using .add methods', async () => {
    const output = await run(async (progress) => {
      progress.start();
      progress.add({ total: 100 });
      progress.stop();
    });
    const bars = getBars();
    expect(output[0].trim()).toMatch(bars.trim());
  });

  it('renders two bars', async () => {
    const output = await run(async (progress) => {
      progress.start();
      progress.add({ total: 100 });
      progress.add({ total: 100 });
      progress.stop();
    });
    const bars = getBars();
    expect(output[0].trim()).toMatch(bars.trim());
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders three bars with individual progress', async () => {
    const output = await run(async (progress) => {
      progress.start();
      const b1 = progress.add({ total: 100 });
      const b2 = progress.add({ total: 100 });
      const b3 = progress.add({ total: 100 });
      b1.update({ value: 10 });
      b3.update({ value: 20 });
      b2.update({ value: 50 });
      progress.stop();
    });
    let bars = getBars();
    expect(output[0].trim()).toMatch(bars.trim());
    expect(output[1].trim()).toMatch(bars.trim());
    expect(output[3].trim()).toMatch(bars.trim());
    expect(output[4].trim()).toMatch(bars.trim());
    expect(output[6].trim()).toMatch(bars.trim());
    expect(output[8].trim()).toMatch(bars.trim());
    bars = getBars(3, 10);
    expect(output[9].trim()).toMatch(bars.trim());
    bars = getBars();
    expect(output[11].trim()).toMatch(bars.trim());
    expect(output[13].trim()).toMatch(bars.trim());
    bars = getBars(3, 10);
    expect(output[14].trim()).toMatch(bars.trim());
    bars = getBars();
    expect(output[16].trim()).toMatch(bars.trim());
    bars = getBars(6, 20);
    expect(output[18].trim()).toMatch(bars.trim());
    bars = getBars(3, 10);
    expect(output[19].trim()).toMatch(bars.trim());
    bars = getBars(15, 50);
    expect(output[21].trim()).toMatch(bars.trim());
    bars = getBars(6, 20);
    expect(output[23].trim()).toMatch(bars.trim());
    expect(output[24].trim()).toMatch('');
    expect(output[25]).toBeUndefined();
  });
});
