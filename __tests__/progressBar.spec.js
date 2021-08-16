import { PassThrough } from 'stream';
import { style } from '@open-tech-world/es-cli-styles';

import { ProgressBar } from '../lib/index.esm.js';

function getStream(isTTY = true) {
  const stream = new PassThrough();
  stream.clearLine = () => true;
  stream.cursorTo = () => true;
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

describe('ProgressBar', () => {
  it('renders gray bars, 0%', async () => {
    const output = await run(async (progress) => {
      progress.run({ value: 0, total: 5 });
    });
    const bars = style('~gray.dim{\u{2588}}').repeat(30);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch(bars + ' 0%');
  });

  it('renders 10 width gray bars, 0%', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 0, total: 5 });
      },
      { width: 10 }
    );
    const bars = style('~gray.dim{\u{2588}}').repeat(10);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch(bars + ' 0%');
  });

  it('renders gray bars, 0% & prefix', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 0, total: 5 });
      },
      { prefix: 'Loading' }
    );
    const bars = style('~gray.dim{\u{2588}}').repeat(30);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch('Loading ' + bars + ' 0%');
  });

  it('renders gray bars, 0% & suffix', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 0, total: 5 });
      },
      { suffix: 'ETA: 5 mins' }
    );
    const bars = style('~gray.dim{\u{2588}}').repeat(30);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch(bars + ' 0% ETA: 5 mins');
  });

  it('renders gray bars, 0%, both prefix & suffix', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 0, total: 5 });
      },
      { prefix: 'Downloading', suffix: 'ETA: 5 mins' }
    );
    const bars = style('~gray.dim{\u{2588}}').repeat(30);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch('Downloading ' + bars + ' 0% ETA: 5 mins');
  });

  it('renders 3 green bars, 27 gray bars for 10% progress', async () => {
    const output = await run(async (progress) => {
      progress.run({ value: 10, total: 100 });
    });
    const greenBars = style('~green.bold{\u{2588}}').repeat(3);
    const grayBars = style('~gray.dim{\u{2588}}').repeat(27);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch(greenBars + grayBars + ' 10%');
  });

  it('renders 15 green bars, 15 gray bars for 50% progress', async () => {
    const output = await run(async (progress) => {
      progress.run({ value: 50, total: 100 });
    });
    const greenBars = style('~green.bold{\u{2588}}').repeat(15);
    const grayBars = style('~gray.dim{\u{2588}}').repeat(15);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch(greenBars + grayBars + ' 50%');
  });

  it('renders all green bars for 100% progress', async () => {
    const output = await run(async (progress) => {
      progress.run({ value: 78, total: 78 });
    });
    const greenBars = style('~green.bold{\u{2588}}').repeat(30);
    expect(output).toHaveLength(2);
    expect(output[0].trim()).toMatch(greenBars + ' 100%');
  });

  it('renders orange bars for 55% progress', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 55, total: 100 });
      },
      { color: 'orange' }
    );
    const orangeBars = style('~bold.orange{\u{2588}}').repeat(16);
    const grayBars = style('~dim.gray{\u{2588}}').repeat(14);
    expect(output).toHaveLength(1);
    expect(output[0].trim()).toMatch(orangeBars + grayBars + ' 55%');
  });

  test('multiple colors', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 25, total: 100, color: 'red' });
        progress.run({ value: 50, total: 100, color: 'yellow' });
        progress.run({ value: 100, total: 100, color: 'green' });
      },
      { width: 60 }
    );

    expect(output).toHaveLength(4);

    const redBars = style('~bold.red{\u{2588}}').repeat(15);
    let grayBars = style('~dim.gray{\u{2588}}').repeat(45);
    expect(output[0].trim()).toMatch(redBars + grayBars + ' 25%');

    const yellowBars = style('~bold.yellow{\u{2588}}').repeat(30);
    grayBars = style('~dim.gray{\u{2588}}').repeat(30);
    expect(output[1].trim()).toMatch(yellowBars + grayBars + ' 50%');

    const greenBars = style('~bold.green{\u{2588}}').repeat(60);
    expect(output[2].trim()).toMatch(greenBars + ' 100%');
  });

  it('auto clears the progress bar', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 25, total: 100, prefix: 'Updating OS' });
        progress.run({ value: 50, total: 100, suffix: 'Updating kernel' });
        progress.run({
          value: 75,
          total: 100,
          prefix: 'Finishing Update',
          suffix: '',
          color: 'green',
        });
        progress.run({ value: 100, total: 100 });
      },
      { autoClear: true, width: 60, color: 'blue' }
    );

    expect(output).toHaveLength(4);

    let blueBars = style('~bold.blue{\u{2588}}').repeat(15);
    let grayBars = style('~dim.gray{\u{2588}}').repeat(45);
    expect(output[0].trim()).toMatch(
      'Updating OS ' + blueBars + grayBars + ' 25%'
    );

    blueBars = style('~bold.blue{\u{2588}}').repeat(30);
    grayBars = style('~dim.gray{\u{2588}}').repeat(30);
    expect(output[1].trim()).toMatch(
      'Updating OS ' + blueBars + grayBars + ' 50% Updating kernel'
    );

    const greenBars = style('~bold.green{\u{2588}}').repeat(45);
    grayBars = style('~dim.gray{\u{2588}}').repeat(15);
    expect(output[2].trim()).toMatch(
      'Finishing Update ' + greenBars + grayBars + ' 75%'
    );
  });

  test('non interactive terminals', async () => {
    const output = await run(
      async (progress) => {
        progress.run({ value: 0, total: 100, prefix: 'Running task' });
        progress.run({ value: 50, total: 100 });
        progress.run({ value: 100, total: 100, suffix: 'Done!' });
      },
      {},
      false
    );

    expect(output).toHaveLength(3);
    expect(output[0]).toMatch('Running task 0% \n');
    expect(output[1]).toMatch('Running task 50% \n');
    expect(output[2]).toMatch('Running task 100% Done!\n');
  });
});
