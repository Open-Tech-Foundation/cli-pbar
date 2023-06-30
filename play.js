import https from 'node:https';
import { sleep } from '@opentf/utils';
import { ProgressBar } from './dist/index.js';

const files = ['https://nodejs.org/dist/v18.16.1/node-v18.16.1.tar.gz'];

async function download(url, onHeaders, onData, onEnd) {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        onHeaders(res.headers);
        res.on('data', async (chunk) => {
          onData(chunk);
        });
        res.on('end', () => {
          onEnd();
          resolve();
        });
      })
      .on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
  });
}

function dFile(url, pBar) {
  let bar;
  let value = 0;

  download(
    url,
    (headers) => {
      bar = pBar.add({
        total: +headers['content-length'],
        prefix: 'NodeJS 18.0.0',
      });
    },
    (chunk) => {
      value += chunk.length;
      bar.update({ value, suffix: 'Downloading...' });
    },
    () => {
      bar.update({ suffix: '' });
    }
  );
}

async function run() {
  // const pBar = new ProgressBar({ size: 'DEFAULT' });
  // pBar.start({ total: 150 });
  // await sleep(500);
  // pBar.update({ value: 10 });
  // await sleep(500);
  // pBar.update({ value: 50 });
  // await sleep(500);
  // pBar.update({ value: 75 });
  // await sleep(500);
  // pBar.update({ value: 100 });
  // await sleep(500);
  // pBar.update({ value: 140 });
  // pBar.stop();

  // const downloadBar = new ProgressBar();
  // downloadBar.start();

  // dFile(files[0], downloadBar);
  // dFile(files[0], downloadBar);

  // const multiPBar = new ProgressBar({ size: 'MEDIUM' });
  // const client = multiPBar.add({ total: 100, prefix: 'Client' });
  // multiPBar.start();
  // const server = multiPBar.add({ total: 100, prefix: 'Server' });
  // await sleep(500);
  // client.update({ value: 25 });
  // await sleep(500);
  // server.update({ value: 25 });
  // await sleep(500);
  // client.update({ value: 50 });
  // await sleep(500);
  // server.update({ value: 50 });
  // await sleep(500);
  // server.update({ value: 75 });
  // await sleep(1000);
  // multiPBar.stop();
}

run();
