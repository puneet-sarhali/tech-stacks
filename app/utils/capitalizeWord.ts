export function capitalizeWords(sentence: string): string {
  const words = sentence.split(" ");
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word;
    }
    const firstLetter = word[0].toUpperCase();
    const restOfWord = word.slice(1);
    return firstLetter + restOfWord;
  });

  return capitalizedWords.join(" ");
}
