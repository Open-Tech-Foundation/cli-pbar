import { EOL } from 'node:os';
import { style } from '@opentf/cli-styles';
import {
  compact,
  intersperse,
  isObj,
  percentage,
  percentageOf,
  shallowMerge,
} from '@opentf/std';
import { type Bar, type BarSize, type Options } from './types';
import {
  DEFAULT_BAR_CHAR,
  MEDIUM_BAR_CHAR,
  PLAIN_DONE_BAR_CHAR,
  PLAIN_NOT_DONE_BAR_CHAR,
  SMALL_BAR_CHAR,
} from './constants';

class ProgressBar {
  private _options: Options = {
    stream: process.stderr,
    width: 30,
    color: 'g',
    bgColor: 'gr',
    autoClear: false,
    size: 'DEFAULT',
    prefix: '',
    suffix: '',
    showPercent: true,
    showCount: false,
    variant: 'STANDARD',
  };
  private _bars: Bar[];

  constructor(options?: Partial<Options>) {
    const opts =
      options?.variant === 'PLAIN'
        ? { ...this._options, color: '', bgColor: '' }
        : this._options;
    this._options = shallowMerge(opts, options as object) as Options;
    this._bars = [];
  }

  private _getBarCharBySize(size: BarSize | undefined) {
    const s = size || this._options.size;
    if (s === 'SMALL') {
      return SMALL_BAR_CHAR;
    } else if (s === 'MEDIUM') {
      return MEDIUM_BAR_CHAR;
    }

    return DEFAULT_BAR_CHAR;
  }

  private _getBars(bar: Bar, percent: number): string {
    let doneBars, bgBars;
    const color = bar.color || this._options.color;
    const bgColor = bar.bgColor || this._options.bgColor;
    const percentVal = Math.trunc(percentageOf(percent, this._options.width));

    if (this._options.variant === 'PLAIN') {
      doneBars = style(`$${color}.bol{${PLAIN_DONE_BAR_CHAR}}`).repeat(
        percentVal
      );
      bgBars = style(`$${bgColor}.dim{${PLAIN_NOT_DONE_BAR_CHAR}}`).repeat(
        this._options.width - percentVal
      );
    } else {
      const barChar = this._getBarCharBySize(bar.size);
      doneBars = style(`$${color}.bol{${barChar}}`).repeat(percentVal);
      bgBars = style(`$${bgColor}.dim{${barChar}}`).repeat(
        this._options.width - percentVal
      );
    }

    return doneBars + bgBars;
  }

  private _render() {
    this._bars.forEach((b, i) => {
      let str = '';

      if (i > 0 && this._options.stream.isTTY) {
        this._options.stream.write(EOL);
      }

      const prefix = Object.hasOwn(b, 'prefix')
        ? b.prefix
        : this._options.prefix;
      const suffix = Object.hasOwn(b, 'suffix')
        ? b.suffix
        : this._options.suffix;
      const showPercent = Object.hasOwn(b, 'showPercent')
        ? b.showPercent
        : this._options.showPercent;
      const showCount = Object.hasOwn(b, 'showCount')
        ? b.showCount
        : this._options.showCount;
      const variant = Object.hasOwn(b, 'variant')
        ? b.variant
        : this._options.variant;

      const percent = b.total
        ? Math.trunc(percentage(isNaN(b.value) ? 0 : b.value, b.total))
        : 0;

      if (b.progress && this._options.stream.isTTY) {
        const bar = this._getBars(b, percent);
        str += (
          intersperse(
            compact([
              prefix,
              variant === 'PLAIN' ? `[${bar}]` : bar,
              showPercent ? percent + '%' : null,
              showCount ? `[${b.value || 0}/${b.total || 0}]` : null,
              suffix,
            ]),
            ' '
          ) as string[]
        ).join('');
      } else {
        str += prefix + ' ' + suffix;
      }

      if (!this._options.stream.isTTY) {
        str = (
          intersperse(
            compact([
              '⏳',
              prefix,
              showPercent ? percent + '%' : null,
              showCount ? `[${b.value || 0}/${b.total || 0}]` : null,
              suffix,
            ]),
            ' '
          ) as string[]
        ).join('');
        this._options.stream.write(str + EOL);
        return;
      }

      if (
        this._options.stream.cursorTo(0) &&
        this._options.stream.clearLine(0)
      ) {
        this._options.stream.write(str);
      }
    });
  }

  /** Starts rendering of the progress bars. */
  start(bar?: Partial<Bar>) {
    if (isObj(bar)) {
      this._bars.push({ ...bar, progress: true } as Bar);
    }
    this._render();
  }

  private _clear() {
    this._options.stream.moveCursor(0, -(this._bars.length - 1));
    this._options.stream.cursorTo(0);
    this._options.stream.clearScreenDown();
  }

  /** Stops the current progress bar with optional message to display. */
  stop(msg?: string) {
    if (this._options.autoClear) {
      this._clear();
      if (msg) {
        this._options.stream.write(msg + EOL);
      }
      return;
    }
    this._options.stream.write(EOL);
  }

  /** Update the current progress bar */
  update(bar: Partial<Bar>, id?: number) {
    if (!id) {
      this._bars[0] = { ...(this._bars[0] as Bar), ...bar } as Bar;
    } else {
      const index = this._bars.findIndex((b) => isObj(b) && b.id === id);
      this._bars[index] = { ...(this._bars[index] as Bar), ...bar } as Bar;
    }
    this._options.stream.moveCursor(0, -(this._bars.length - 1));
    this._render();
  }

  /** Adds a new progress bar to the rendering stack. */
  add(bar: Partial<Bar>) {
    const id = this._bars.length + 1;
    const barInstance = { progress: true, ...bar, id } as Bar;
    this._bars.push(barInstance);
    if (this._bars.length > 2) {
      this._options.stream.moveCursor(0, -(this._bars.length - 2));
    }
    this._render();
    return {
      update: (bar: Partial<Bar>) => {
        this.update(bar, id);
      },
      inc: (bar?: Partial<Bar>, val = 1) => {
        const curBar = this._bars.find((b) => b.id === id);
        const n = curBar?.value || 0;
        this.update({ ...bar, value: n + val }, id);
      },
    };
  }

  /** Increment the value + 1, optionally with the provided value. */
  inc(bar?: Partial<Bar>, val = 1) {
    const n = this._bars[0]?.value || 0;
    this.update({ ...bar, value: n + val });
  }
}

export default ProgressBar;
