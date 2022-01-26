import { compareTwoStrings } from "string-similarity";

export const detectHeadlines = ({
  rows,
  detectionRangeSize = 8,
}: {
  rows: unknown[][];
  detectionRangeSize?: number;
}) => {
  const similarities: number[][] = [];
  for (let j = 0; j < rows[0].length; j++) {
    for (let i = 0; i < detectionRangeSize; i++) {
      if (rows[i + 1]) {
        if (similarities[j] === undefined) similarities[j] = [];
        const nextString = String(rows[i + 1][j]);
        similarities[j].push(
          Math.round(compareTwoStrings(String(rows[i][j]), nextString))
        );
      } else {
        break;
      }
    }
  }

  let headlinesCount = Math.round(
    similarities
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
    rows[headlinesCount - 1] &&
    //count empty cells and cells starts with a number
    rows[headlinesCount - 1].reduce<number>((acc, val) => {
      const test = String(val).trim();
      (!test || test.match(/^[0-9.,+ -]+/)) && ++acc;
      return acc;
    }, 0) + //plus count of empty array elements:
      rows[headlinesCount - 1].length -
      rows[headlinesCount - 1].filter(String).length >=
      1
  ) {
    headlinesCount--;
  }

  return headlinesCount;
};
