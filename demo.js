import { sleep } from '@opentf/utils';
import { style } from '@opentf/cli-styles';
import { ProgressBar } from './dist/index.js';

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

await defaultBar();
await mediumBar();
await smallBar();
await prefixSuffix();
