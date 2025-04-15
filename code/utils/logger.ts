import { FileLogger } from 'react-native-file-logger';

FileLogger.configure();

export const log = (log: string) => {
  FileLogger.error(log);
  FileLogger.sendLogFilesByEmail({ subject: 'Logs from SteveQueue', body: log, to: 'stav134679@gmail.com' });
};
