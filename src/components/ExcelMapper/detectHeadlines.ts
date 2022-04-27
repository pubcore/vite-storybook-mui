import { compareTwoStrings } from "string-similarity";
import { stringSimilarity } from "string-similarity-js";

export const detectHeadlines = ({
  rows,
  detectionRangeSize = 8,
}: {
  rows: unknown[][];
  detectionRangeSize?: number;
}) => {
  const similarities: number[][] = [];

  if (rows.length == 0) {
    return 0;
  }
  //a column with m rows is a numberColumn, if it consists of
  //1...n[none empty none number row value] + n+1...m[number row value]
  const numberColumns: number[] = [];
  const REGEX = /[,.+\s-]/g;
  function isRelevantNumber(v: unknown) {
    return (
      String(v).length > 4 /* ignore short integers e.g. year */ &&
      !!Number(String(v).replaceAll(REGEX, ""))
    );
  }
  for (let j = 0; j < (rows[0]?.length ?? 0); j++) {
    for (let i = 0; i < Math.min(rows.length, detectionRangeSize); i++) {
      const currentVal = rows[i]?.[j];
      const nextVal = rows[i + 1]?.[j];
      const currentValIsNumber = isRelevantNumber(currentVal);

      //number columns ...
      if (
        !currentValIsNumber &&
        currentVal != "" &&
        currentVal !== undefined &&
        numberColumns[j] === undefined
      ) {
        //do nothing
      } else if (currentValIsNumber && numberColumns[j] === undefined) {
        numberColumns[j] = i + 1;
      } else if (
        (currentValIsNumber || currentVal == "" || currentVal == undefined) &&
        (numberColumns[j] ?? 0) >= 1
      ) {
        //do nothing
      } else {
        numberColumns[j] = 0;
      }

      //similarities ...
      if (similarities[j] === undefined) similarities[j] = [];
      if (currentValIsNumber || isRelevantNumber(nextVal)) {
        similarities[j]?.push(1);
      } else {
        similarities[j]?.push(
          Math.round(
            Math.max(
              compareTwoStrings(String(currentVal), String(nextVal)),
              stringSimilarity(
                String(currentVal),
                String(nextVal),
                String(currentVal).includes(" ") ? undefined : 1
              )
            )
          )
        );
      }
    }
  }

  let headlinesCount =
    numberColumns.reduce(
      (acc, headCount) => (headCount > 0 ? headCount : acc),
      0
    ) || // fallback logic, if there is no number column ...
    Math.round(
      similarities
        //only use similarity fields with more than 4 ones
        .filter(
          (similary) => similary.reduce((acc, sim) => (acc += sim), 0) > 4
        )
        //collect first jumps from 0 to 1
        .reduce<number[]>(
          (agg, similary) => agg.concat(similary.findIndex((s) => s == 1)),
          []
        )
        //arithmetic mean of jump positions of all columns
        .reduce<number>(
          (sum, jumpAt, _, cols) => (sum += jumpAt / cols.length),
          0
        )
    );

  if (headlinesCount <= 1) {
    headlinesCount = 2;
  }

  //there could be only one or no data row ... check last header row
  if (
    Array.isArray(rows[headlinesCount - 1]) &&
    //count empty cells and cells starts with a number
    rows[headlinesCount - 1]!.reduce<number>((acc, val) => {
      const test = String(val).trim();
      (!test || test.match(/^[0-9.,+ -]+/)) && ++acc;
      return acc;
    }, 0) + //plus count of empty array elements:
      rows[headlinesCount - 1]!.length -
      rows[headlinesCount - 1]!.filter(String).length >=
      1
  ) {
    headlinesCount--;
  }

  return headlinesCount;
};
