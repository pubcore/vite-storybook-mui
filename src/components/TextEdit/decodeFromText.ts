import { INVISIBLE_REGEX, NUMBER_OF_BITS } from "./const";
import { decodeNumber } from "./decodeNumber";

export function decodeFromText(text: string) {
  const encodedTextKeys = Array.from(
    new Set(
      text.match(INVISIBLE_REGEX)?.filter((m) => m.length >= NUMBER_OF_BITS)
    )
  );
  return encodedTextKeys?.map(decodeNumber) || [];
}
