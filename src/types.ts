import type { WriteStream } from 'node:tty';

export type BarSize = 'SMALL' | 'MEDIUM' | 'DEFAULT';

export type Options = {
  /** The wriatable stream to use, default is stderr. */
  stream: WriteStream;
  /** The width of the rendered progress bar. */
  width: number;
  /** The foreground color of completed bars. */
  color: string;
  /** The background color of bars. */
  bgColor: string;
  /** Set true to remove the progress bar after it completed. */
  autoClear: boolean;
  /** The size of the progress bar to render, default is 30. */
  size: BarSize;
  /** The string to be prefixed progress bar */
  prefix: string;
  /** The string to be suffixed progress bar */
  suffix: string;
  /** Show hide progress bar percent */
  showPercent: boolean;
  /** Show hide progress bar count */
  showCount: boolean;
};

export type Bar = Omit<Options, 'stream' | 'width' | 'autoClear'> & {
  id?: number;
  total: number;
  value: number;
  progress?: boolean;
};
