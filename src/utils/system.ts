import os from 'os';

export const isWindows = (): boolean => {
  return process.platform === 'win32';
};

export const checkRoot = (): boolean => {
  // In Windows, this is more complex - this is simplified
  return process.getuid ? process.getuid() === 0 : false;
};