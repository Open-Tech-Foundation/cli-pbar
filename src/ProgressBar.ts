import { style } from '@open-tech-world/es-cli-styles';

import IOptions from './IOptions';
import IRunOptions from './IRunOptions';
import { percentage, percentageOf } from './math';

class ProgressBar {
  private stream: NodeJS.WriteStream;
  private width: number;
  private prefix: string;
  private suffix: string;
  private color: string;
  private isStopped: boolean;
  private autoClear: boolean;
  private tty: boolean;

  constructor(options?: Partial<IOptions>) {
    this.stream = options?.stream || process.stderr;
    this.tty = this.stream.isTTY;
    this.width = options?.width || 30;
    this.prefix = options?.prefix || '';
    this.suffix = options?.suffix || '';
    this.color = options?.color || 'green';
    this.isStopped = false;
    this.autoClear = options?.autoClear || false;
  }

  private render(str: string): void {
    if (this.stream.cursorTo(0) && this.stream.clearLine(0)) {
      this.stream.write(str);
    }
  }

  private getBars(percent: number): string {
    const percentVal = percentageOf(percent, this.width);
    const doneBars = style(`~${this.color}.bold{\u{2588}}`).repeat(percentVal);
    const bgBars = style('~gray.dim{\u{2588}}').repeat(this.width - percentVal);
    return doneBars + bgBars;
  }

  stop(clear = false): void {
    this.isStopped = true;

    if (!this.tty) {
      return;
    }

    if (clear || this.autoClear) {
      this.stream.cursorTo(0);
      this.stream.clearLine(1);
    } else {
      this.stream.write('\n');
    }
  }

  run(options: IRunOptions): void {
    if (this.isStopped) {
      return;
    }

    const percent = percentage(options.value, options.total);

    if (options.prefix !== undefined) {
      this.prefix = options.prefix;
    }

    if (options.suffix !== undefined) {
      this.suffix = options.suffix;
    }

    if (this.tty) {
      if (options.color) {
        this.color = options.color;
      }

      const bar = this.getBars(percent);
      this.render(
        this.prefix + ' ' + bar + ' ' + percent + '% ' + this.suffix + ' '
      );
    } else {
      this.stream.write(this.prefix + ' ' + percent + '%' + this.suffix + '\n');
    }

    if (percent === 100) {
      this.stop();
    }
  }
}

export default ProgressBar;
