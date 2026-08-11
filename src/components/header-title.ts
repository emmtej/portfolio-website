export function splitGreetingWords(greeting: string): string[] {
  return greeting.split(" ");
}

export function getItalianGreetingWordClass(index: number): string | undefined {
  if (index === 0) {
    return "text-it-green";
  }

  if (index === 1) {
    return "text-it-red";
  }

  return undefined;
}
