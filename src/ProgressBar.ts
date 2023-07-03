import { style } from '@opentf/cli-styles';
import { percentage, percentageOf } from '@opentf/utils';
import { type Bar, type BarSize, type Options } from './types';
import { DEFAULT_BAR_CHAR, MEDIUM_BAR_CHAR, SMALL_BAR_CHAR } from './constants';

class ProgressBar {
  private _stream: NodeJS.WriteStream;
  private _width: number;
  private _color: string;
  private _bgColor: string;
  private _autoClear: boolean;
  private _bars: Bar[];
  private _size: BarSize;

  constructor(options?: Options) {
    this._stream = options?.stream || process.stderr;
    this._width = options?.width || 30;
    this._color = options?.color || 'g';
    this._bgColor = options?.bgColor || 'gr';
    this._autoClear = options?.autoClear || false;
    this._bars = [];
    this._size = options?.size || 'DEFAULT';
  }

  private _getBarCharBySize(size: BarSize | undefined) {
    const s = size || this._size;
    if (s === 'DEFAULT') {
      return DEFAULT_BAR_CHAR;
    } else if (s === 'MEDIUM') {
      return MEDIUM_BAR_CHAR;
    }

    return SMALL_BAR_CHAR;
  }

  private _getBars(bar: Bar, percent: number): string {
    const barChar = this._getBarCharBySize(bar.size);
    const color = bar.color || this._color;
    const bgColor = bar.bgColor || this._bgColor;
    const percentVal = Math.trunc(percentageOf(percent, this._width));
    const doneBars = style(`$${color}.bol{${barChar}}`).repeat(percentVal);
    const bgBars = style(`$${bgColor}.dim{${barChar}}`).repeat(
      this._width - percentVal
    );
    return doneBars + bgBars;
  }

  private _render() {
    this._bars.forEach((b, i) => {
      let str = '';

      if (i > 0) {
        this._stream.write('\n');
      }

      const prefix = b.prefix || '';
      const suffix = b.suffix || '';
      if (b.progress) {
        const percent = b.total
          ? Math.trunc(percentage(isNaN(b.value) ? 0 : b.value, b.total))
          : 0;
        const bar = this._getBars(b, percent);
        str += prefix + ' ' + bar + ' ' + percent + '% ' + suffix;
      } else {
        str += prefix + ' ' + suffix;
      }

      if (this._stream.cursorTo(0) && this._stream.clearLine(0)) {
        this._stream.write(str);
      }
    });
  }

  start(obj?: Partial<Bar>) {
    if (typeof obj === 'object') {
      this._bars.push({ ...obj, progress: true } as Bar);
    }
    this._render();
  }

  _clear() {
    this._stream.moveCursor(0, -(this._bars.length - 1));
    this._stream.cursorTo(0);
    this._stream.clearScreenDown();
  }

  stop(msg?: string) {
    if (this._autoClear) {
      this._clear();
      if (msg) {
        this._stream.write(msg + '\n');
      }
      return;
    }
    this._stream.write('\n');
  }

  update(obj: Partial<Bar>, id?: number) {
    if (!id) {
      this._bars[0] = { ...(this._bars[0] as Bar), ...obj } as Bar;
    } else {
      const index = this._bars.findIndex(
        (b) => typeof b === 'object' && b.id === id
      );
      this._bars[index] = { ...(this._bars[index] as Bar), ...obj } as Bar;
    }
    this._stream.moveCursor(0, -(this._bars.length - 1));
    this._render();
  }

  add(obj: Partial<Bar>) {
    if (typeof obj === 'object') {
      const id = this._bars.length + 1;
      const barInstance = { progress: true, ...obj, id } as Bar;
      this._bars.push(barInstance);
      if (this._bars.length > 2) {
        this._stream.moveCursor(0, -(this._bars.length - 2));
      }
      this._render();
      return {
        update: (obj: Partial<Bar>) => {
          this.update(obj, id);
        },
      };
    }

    return null;
  }
}

export default ProgressBar;
