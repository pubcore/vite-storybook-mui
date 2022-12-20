import { parse } from "papaparse";

//normalize delimiter, for cells having multiple values
//eg. "one, two, three" => "one| two| three"
export function delimiters(
  s: string | null | undefined,
  { to, numbers = (s) => s }: { to: string; numbers?: (s: string) => string }
) {
  if (s === null || s === undefined) {
    return s;
  }
  const { data } = parse<string[]>(numbers(s));
  return data
    .reduce(
      (acc, line) => acc.concat(line.filter((val) => val.trim() !== "")),
      []
    )
    .join(to);
}
