# @open-tech-world/cli-progress-bar

> Node.js CLI progress bar.

## Install

```bash
# With npm
$ npm install @open-tech-world/cli-progress-bar

# With yarn
$ yarn add @open-tech-world/cli-progress-bar
```

## Usage

```js
const ProgressBar = require('@open-tech-world/cli-progress-bar');

// or

import ProgressBar from '@open-tech-world/cli-progress-bar';

const progressBar = new ProgressBar();
progressBar.run('Downloading', 0, 100);
progressBar.run('Download completed', 100, 100);
progressBar.stop();
```

## Examples

See more [examples here](/examples)

Clone the repo and run it

```bash
$ node examples/simple.js
```

## API

### constructor(options = {})
The initializing method of a `ProgressBar` class.

```js
new ProgressBar();

new ProgressBar({});

new ProgressBar({ width: 40 });
```

options: object, default `{}`

- width: number, default `30`
- stream: stream, default `process.stderr`
- barChar: string, default `'\u2588'`

### run(action = '', curVal = 0, totalVal = 0, statusText = '')
Starts and updates the current progress bar instance.

```js
progressBar.run('Running tasks', 23, 150)

progressBar.run('Downloaded', 72, 72)

progressBar.run('Downloading', 3, 10, `ETA: ${speed}`)
```

- action: string, default `''` - used to display progress bar actions on the left side
- curVal: number, default `0` - current value of a progress bar
- totalVal: number, default `0` - total value of a progress bar
- statusText: string, default `''` - used to show some additional info

### stop(clear = false)
Stops the current progress bar instance with the current state and optionally clears the line.

```js
progressBar.stop()

progressBar.stop(true)
```

- clear: boolean, default `false` - used to clear or remove the progress bar after stops

## License

MIT © [Thanga Ganapathy](https://github.com/ganapathy888)
