/**
 * @see https://github.com/juanjoDiaz/json2csv/issues/1
 */
declare module "@json2csv/plainjs" {
  export class Parser {
    parse: <T>(data: T[]) => string;
    constructor(opts: {
      withBOM?: true;
      delimiter?: string;
      /**
       * @see https://www.npmjs.com/package/@json2csv/transforms
       */
      transforms?: Array<(row: unknown) => Record<string | number, unknwon>>;
    });
  }
}
