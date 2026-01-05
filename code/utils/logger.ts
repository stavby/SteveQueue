import { FileLogger } from 'react-native-file-logger';

FileLogger.configure();

export const log = (log: string) => {
  console.error(log);
  FileLogger.error(log);
};
