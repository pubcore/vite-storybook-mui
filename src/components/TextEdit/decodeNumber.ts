import { INVISIBLE_CHARACTERS } from "./const";

export function decodeNumber(encodedNumber: string) {
  const bits = Array.from(encodedNumber)
    .map((character) => {
      return INVISIBLE_CHARACTERS.indexOf(character);
    })
    .map(String)
    .join("");
  return parseInt(bits, 2);
}
