export type BarSize = 'SMALL' | 'MEDIUM' | 'DEFAULT';

export type Options = {
  stream?: NodeJS.WriteStream;
  width?: number;
  color?: string;
  bgColor?: string;
  autoClear?: boolean;
  size?: BarSize;
};

// export interface IRunOptions {
//   total: number;
//   value: number;
//   prefix?: string;
//   suffix?: string;
//   color?: string;
// }

export type Bar = {
  total: number;
  value: number;
  id?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  bgColor?: string;
  size?: BarSize;
};
