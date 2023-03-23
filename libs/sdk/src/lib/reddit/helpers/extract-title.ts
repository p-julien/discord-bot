const titlePattern = /^\*\*([^*]*)\*\*/;

export function extractTitle(str: string): string {
  const lines = str.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(titlePattern);

    if (match) {
      return line;
    }
  }

  return null;
}
