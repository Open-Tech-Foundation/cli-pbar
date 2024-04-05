import https from 'node:https';
import path from 'node:path';
import { aForEach, sleep } from '@opentf/std';
import { style } from '@opentf/cli-styles';
import { ProgressBar } from './src';

function template(title, options = {}) {
  console.log(style(`$o.bol.und{\n${title}\n}`));
  return new ProgressBar(options);
}

function defaultBar() {
  return new Promise((resolve) => {
    const pBar = template('Default');
    pBar.start({ total: 100 });
    let value = 0;
    const intervalID = setInterval(() => {
      value += 10;
      pBar.update({ value });
      if (value === 100) {
        pBar.stop();
        clearInterval(intervalID);
        resolve();
      }
    }, 100);
  });
}

function mediumBar() {
  return new Promise((resolve) => {
    const pBar = template('Medium size + Blue bar', {
      size: 'MEDIUM',
      color: 'b',
    });
    pBar.start({ total: 100 });
    let value = 0;
    const intervalID = setInterval(() => {
      value += 10;
      pBar.update({ value });
      if (value === 100) {
        pBar.stop();
        clearInterval(intervalID);
        resolve();
      }
    }, 100);
  });
}

function smallBar() {
  return new Promise((resolve) => {
    const pBar = template('Small size + Red bar', {
      size: 'SMALL',
      color: 'r',
    });
    pBar.start({ total: 100 });
    let value = 0;
    const intervalID = setInterval(() => {
      value += 10;
      pBar.update({ value });
      if (value === 100) {
        pBar.stop();
        clearInterval(intervalID);
        resolve();
      }
    }, 100);
  });
}

function prefixSuffix() {
  return new Promise((resolve) => {
    const pBar = template('Prefix + Bar + Suffix');
    pBar.start({ total: 100, prefix: 'Installing npm pkgs' });
    const pkgs = ['babel', 'rollup', 'webpack', 'vite', 'react'];
    let value = 0;
    const intervalID = setInterval(() => {
      value += 20;
      pBar.update({ value, suffix: pkgs.pop() });
      if (value === 100) {
        pBar.update({ prefix: '', suffix: 'Install completed.' });
        pBar.stop();
        clearInterval(intervalID);
        resolve();
      }
    }, 500);
  });
}

async function downloading() {
  const files = [
    'https://nodejs.org/dist/v16.0.0/node-v16.0.0-x64.msi',
    'https://nodejs.org/dist/v18.16.1/node-v18.16.1-x64.msi',
    'https://nodejs.org/dist/v20.0.0/node-v20.0.0-x64.msi',
  ];

  function download(url, pBar) {
    return new Promise((resolve) => {
      let bar;
      let value = 0;
      https
        .get(url, (res) => {
          bar = pBar.add({
            total: +res.headers['content-length'],
          });
          res.on('data', (chunk) => {
            value += chunk.length;
            bar.update({ value, suffix: path.basename(url) });
          });
          res.on('end', () => {
            resolve();
          });
        })
        .on('error', (e) => {
          console.error(`Got error: ${e.message}`);
        });
    });
  }

  console.log('Downloading files:');
  const downloadBar = template('Multi Progressbar', { size: 'MEDIUM' });
  downloadBar.start();
  await Promise.all(files.map((f) => download(f, downloadBar)));
  downloadBar.stop();
}

async function autoClear() {
  const pBar = template('Multi + Auto Clear + Stop msg', { autoClear: true });
  console.log();
  console.log('Compiling web application...');
  console.log();
  pBar.start();
  const client = pBar.add({
    total: 100,
    color: 'rgb(0,181,34)',
    prefix: style('$rgb(0,181,34){● Client}'),
  });
  const cfiles = pBar.add({
    progress: false,
  });
  pBar.add({
    progress: false,
  });
  const server = pBar.add({
    total: 100,
    color: 'hex(#FFB12B)',
    prefix: style('$hex(#FFB12B){● Server}'),
  });
  const sfiles = pBar.add({
    progress: false,
  });
  const pkgs = [
    'react',
    'zustand',
    'recoil',
    'lodash',
    '@opentf/std',
    'emotion',
    'material-ui',
    'pandacss',
    'postcss',
    'tailwind',
  ];
  const sFiles = ['login', 'logout', 'products', 'dashboard', 'authorize'];
  let cVal = 0;
  let sVal = 0;
  const intervalID = setInterval(() => {
    if (cVal < 100) {
      cVal += 10;
      client.update({ value: cVal });
      cfiles.update({
        suffix: `/node_modules/${pkgs.pop()}/index.js`,
      });
    }

    if (sVal < 100) {
      sVal += 20;
      server.update({ value: sVal });
      sfiles.update({ suffix: `/api/${sFiles.pop()}.js` });
    }

    if (sVal === 100) {
      sfiles.update({ suffix: '' });
    }

    if (cVal === 100) {
      cfiles.update({ suffix: '' });
    }

    if (cVal === 100 && sVal === 100) {
      pBar.stop('Successfully compiled, your app is now ready to deploy 🚀');
      clearInterval(intervalID);
    }
  }, 100);

  await sleep(1500);
}

async function styledTexts() {
  const multiPBar = template('Styled Texts', {});
  multiPBar.start();
  const b1 = multiPBar.add({ total: 100 });
  const t1 = multiPBar.add({ progress: false });
  const b2 = multiPBar.add({ total: 100 });
  const t2 = multiPBar.add({ progress: false });
  const b3 = multiPBar.add({ total: 100 });
  const t3 = multiPBar.add({ progress: false });
  b1.update({ value: 23, prefix: 'ProgressBar 1', color: 'g' });
  t1.update({ prefix: style('$r{This is some long text}') });
  b3.update({
    value: 35,
    prefix: 'Prefix 3',
    suffix: 'Suffix 3',
    color: 'b',
    bgColor: 'y',
  });
  t2.update({ prefix: 'This is some long text', color: 'bl', bgColor: 'y' });
  b2.update({ value: 17, suffix: 'Suffix 2' });
  t3.update({
    prefix: 'This is some long text with invalid styles.',
    color: 'bl2',
    bgColor: 'y3',
  });
  multiPBar.stop();
}

async function plain() {
  const arr = ['Apple', 'Mango', 'Orange', 'Grapes', 'Pear', 'Guava'];

  const pBar = template('Plain', {
    variant: 'PLAIN',
    prefix: 'Downloading',
    showPercent: true,
    showCount: false,
  });
  pBar.start({ total: arr.length });

  await aForEach(arr, async (f) => {
    await sleep(500);
    pBar.inc({ suffix: f });
  });

  pBar.stop();
}

await defaultBar();
await mediumBar();
await smallBar();
await prefixSuffix();
// await downloading();
await autoClear();
await styledTexts();
await plain();
