export function stripHtml(text) {
  const brMatch = text.match(/^([\s\S]*?)<br\s*\/?>([\s\S]*)$/i);
  if (brMatch) {
    const before = brMatch[1].trim();
    const after = brMatch[2];
    if (!/[.,;:!?'"]$/.test(before)) {
      text = after;
    }
  }

  return text
    .replace(/<S>\d+<\/S>/gi, "")
    .replace(/<sup>[\s\S]*?<\/sup>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function extractLetterWithPunctuation(word) {
  const leadingMatch = word.match(/^[^\p{L}\p{N}]*/u);
  const leading = leadingMatch ? leadingMatch[0] : "";

  const rest = word.slice(leading.length);
  const firstLetter = rest[0] || "";

  const trailingMatch = word.match(/[^\p{L}\p{N}]*$/u);
  const trailing = trailingMatch ? trailingMatch[0] : "";

  return leading + firstLetter + trailing;
}

export function extractLetters(verses) {
  return verses.map((verse) => {
    const words = stripHtml(verse.text).replace(/\n/g, " ").split(/\s+/);
    return {
      verseNumber: verse.verse,
      text: verse.text,
      letters: words.map((word) => extractLetterWithPunctuation(word)).filter(Boolean),
    };
  });
}

export function chunkVerses(verses, size = 25) {
  const chunks = [];
  for (let i = 0; i < verses.length; i += size) {
    chunks.push(verses.slice(i, i + size));
  }
  return chunks;
}
