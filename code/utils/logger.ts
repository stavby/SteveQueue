import { FileLogger } from 'react-native-file-logger';

FileLogger.configure();

export const log = (log: string, level: 'error' | 'warn' | 'log' = 'log') => {
  console[level](log);
  FileLogger.error(log);
};
