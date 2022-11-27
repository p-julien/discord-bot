import { Client } from '../configurations/create-discord-app';
import readline from 'readline';

export class ClientMock implements Client {
  listen() {
    console.log('Call the mock implementation');
    input('Who are you ?').then((name) =>
      console.log(`Name of the user is ${name}`)
    );
  }
}

export const input = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    const read = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    read.question(`${message} `, (input: string) => {
      read.close();
      resolve(input);
    });
  });
};
