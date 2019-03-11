import { Code, Section } from 'src/models/parser';

const headerRegexp = /\s*(PATTERNS|RULES)\s*/;

function parsePatterns(lines: string[], pos: number, sections: Section[]) {
}

export function parseFile(file: File) {
  return new Promise<Code>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const text = event.target.result;
      resolve({ clean: true, text, colors: [ ] });
    };
    reader.onerror = (event: any) => {
      reject(event.error);
    };
    reader.readAsText(file);
  });
}
