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

describe('Single Progress Bar', () => {
  it('renders default 0%', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100 });
      progress.stop();
    });
    const bars = getBars();
    expect(output[0].trim()).toMatch(bars.trim());
  });

  it('renders default 10%', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100 });
      progress.update({ value: 10 });
      progress.stop();
    });
    const bars = getBars(3, 10);
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders default 50%', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100 });
      progress.update({ value: 50 });
      progress.stop();
    });
    const bars = getBars(15, 50);
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders default 100%', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100 });
      progress.update({ value: 100 });
      progress.stop();
    });
    const bars = getBars(30, 100);
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders medium size 10% with blue color', async () => {
    const output = await run(
      async (progress) => {
        progress.start({ total: 100 });
        progress.update({ value: 10 });
        progress.stop();
      },
      { size: 'MEDIUM', color: 'b' }
    );
    const bars = getBars(3, 10, { size: 'MEDIUM', color: 'b' });
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders small size 75% with red color', async () => {
    const output = await run(
      async (progress) => {
        progress.start({ total: 100 });
        progress.update({ value: 75 });
        progress.stop();
      },
      { size: 'SMALL', color: 'r' }
    );
    const bars = getBars(22, 75, { size: 'SMALL', color: 'r' });
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders red bg color', async () => {
    const output = await run(
      async (progress) => {
        progress.start({ total: 100 });
        progress.update({ value: 50 });
        progress.stop();
      },
      { bgColor: 'r' }
    );
    const bars = getBars(15, 50, { bgColor: 'r' });
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders width 50', async () => {
    const output = await run(
      async (progress) => {
        progress.start({ total: 100 });
        progress.update({ value: 50 });
        progress.stop();
      },
      { width: 50 }
    );
    const bars = getBars(25, 50, { width: 50 });
    expect(output[1].trim()).toMatch(bars.trim());
  });

  it('renders with prefix', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100, prefix: 'PREFIX' });
      progress.stop();
    });
    const bars = getBars(0, 0, { prefix: 'PREFIX' });
    expect(output[0].trim()).toMatch(bars.trim());
  });

  it('renders with suffix', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100, prefix: 'SUFFIX' });
      progress.stop();
    });
    const bars = getBars(0, 0, { prefix: 'SUFFIX' });
    expect(output[0].trim()).toMatch(bars.trim());
  });

  it('renders with prefix & suffix', async () => {
    const output = await run(async (progress) => {
      progress.start({ total: 100, prefix: 'SUFFIX', suffix: 'SUFFIX' });
      progress.stop();
    });
    const bars = getBars(0, 0, { prefix: 'SUFFIX', suffix: 'SUFFIX' });
    expect(output[0].trim()).toMatch(bars.trim());
  });
});
