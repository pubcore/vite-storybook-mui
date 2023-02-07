import { INVISIBLE_CHARACTERS, MAX_KEY_INDEX, NUMBER_OF_BITS } from "./const";

export function encodeNumber(n: number) {
  if (n < 0 || n > MAX_KEY_INDEX) {
    throw new TypeError("number out of range");
  }
  const nineBits = (n >>> 0).toString(2).padStart(NUMBER_OF_BITS, "0");
  const stringOfInvisibleChars = Array.from(nineBits)
    .map((b) => INVISIBLE_CHARACTERS[Number(b)])
    .join("");
  return stringOfInvisibleChars;
}
