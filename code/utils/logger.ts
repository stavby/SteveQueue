import { FileLogger } from 'react-native-file-logger';

FileLogger.configure();

export const log = (log: string) => {
  FileLogger.error(log);
};
