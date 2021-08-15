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

  constructor(options?: Partial<IOptions>) {
    this.stream = options?.stream || process.stderr;
    this.width = options?.width || 30;
    this.prefix = options?.prefix || '';
    this.suffix = options?.suffix || '';
    this.color = options?.color || 'green';
    this.isStopped = false;
  }

  private render(str: string): void {
    if (this.stream.cursorTo(0) && this.stream.clearLine(0)) {
      this.stream.write(str);
    }
  }

  private getBar(percent: number): string {
    const percentVal = percentageOf(percent, this.width);
    const doneBars = style(`~${this.color}{\u{2588}}`).repeat(percentVal);
    const bgBars = style('~white{\u{2588}}').repeat(this.width - percentVal);
    return doneBars + bgBars;
  }

  stop(clear = false): void {
    if (clear) {
      this.stream.cursorTo(0);
      this.stream.clearLine(1);
    } else {
      this.stream.write('\n');
    }

    this.isStopped = true;
  }

  run(options: IRunOptions): void {
    if (this.isStopped) {
      return;
    }

    const percent = percentage(options.value, options.total);
    const prefix = options.prefix ? options.prefix : this.prefix;
    const suffix = options.suffix ? options.suffix : this.suffix;
    const bar = this.getBar(percent);
    this.render(prefix + ' ' + bar + ' ' + percent + '% ' + suffix);

    if (percent === 100) {
      this.stop();
    }
  }
}

export default ProgressBar;
