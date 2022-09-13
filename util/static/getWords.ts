// Character = 12px x 26px
// Box = 960px x 78px
// = 240 characters max in box

// Subtract 20 chars to account for length of certain words --> Always fits within box now

export default function getWords(words: string[], amount: number): string {
  let sentence = "";
  let charCount = 220;
  while (charCount > 0) {
    const wordArray = words.filter((word) => word.length <= charCount);
    const word = wordArray[Math.floor(Math.random() * wordArray.length)];

    if (word.length <= charCount) {
      sentence += word + " ";
      charCount -= word.length + 1;
    }
  }

  // for (let i = 0; i < amount; i++) {
  //   const randomIndex = Math.floor(Math.random() * words.length);
  //   const word = words[randomIndex];
  //   sentence += word + " ";
  // }

  return sentence.trim();
}
