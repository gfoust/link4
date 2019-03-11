
export interface Code {
  clean: boolean;
  text: string;
  colors: Section[];
}

export interface Section {
  begin: number;
  end: number;
  description: string;
  color: string;
}
