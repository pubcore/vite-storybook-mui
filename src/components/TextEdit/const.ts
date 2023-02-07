export const NUMBER_OF_BITS = 9; //2^9 => Max. 512 used keys per page
export const INVISIBLE_CHARACTERS = ["\u200C", "\u200D"];
export const INVISIBLE_REGEX = RegExp(
  `([${INVISIBLE_CHARACTERS.join("")}]{${NUMBER_OF_BITS}})+`,
  "gu"
);
export const MAX_KEY_INDEX = Math.pow(2, NUMBER_OF_BITS);
