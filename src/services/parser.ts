import { Code } from 'src/models/parser';

export function parseFile(file: File) {
  return new Promise<Code>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const text = event.target.result;
      resolve({ text, colors: [ ] });
    };
    reader.onerror = (event: any) => {
      reject(event.error);
    };
    reader.readAsText(file);
  });
}
