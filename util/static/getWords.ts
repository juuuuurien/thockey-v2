export default function getWords(words: string[], amount: number): string {
  let sentence = "";

  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    sentence += word + " ";
  }

  return sentence.trim();
}
