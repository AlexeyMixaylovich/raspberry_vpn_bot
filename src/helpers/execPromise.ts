import { exec } from 'child_process';

export type TExecPromiseRes =
  { status: 'error', error: Error }
  | { status: | 'warn' | 'success', data:string };

export const execPromise = (command: string):Promise<TExecPromiseRes> => new Promise((resolve) => {
  exec(command, (execErr, stdout, stderr) => {
    if (execErr) {
      console.error(`❌ Ошибка: ${command}`);
      return resolve({
        status: 'error',
        error: execErr,
      });
    }
    if (stderr) {
      console.error(`⚠️ Предупреждение:: ${command}`);
      return resolve({
        status: 'warn',
        data: stderr,
      });
    }
    console.log(`✅ Успех: ${command}`);
    return resolve({
      status: 'success',
      data: stdout,
    });
  });
});
