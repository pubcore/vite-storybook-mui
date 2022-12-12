//if there are numbers, we have ambiguos cases, which depends on locale:
//e.g 24.000 could be 24000 in germany, but 24.000 in GBR
const ambiguousNumberSepRegex = new RegExp(
  /([^0.9][0-9]{1,3})[,]([0-9]{3}[^0-9])/g
);
const ambiguousNumberSepRegex2 = new RegExp(
  /([^0.9][0-9]{1,3})[.]([0-9]{3}[^0-9])/g
);

//in many cases, we can transform the thousands sep format
// 100.123,0 => 100123,0
// 100,123.0 => 100123.0
const thousandSeperatorRegex = new RegExp(
  /([0-9]{1,3})[,. ]([0-9]{3}[,.][0-9]+)/g
);
const decimalRegex = new RegExp(/([0-9]+),([0-9]{1,2}($|[^0-9]|[0-9]{2,}))/g);

export const numbers = (
  s: string,
  { isEnglishNumberFormat }: { isEnglishNumberFormat: boolean }
) =>
  s
    .replaceAll(
      ambiguousNumberSepRegex2,
      isEnglishNumberFormat ? "$1.$2" : "$1$2"
    )
    .replaceAll(
      ambiguousNumberSepRegex,
      isEnglishNumberFormat ? "$1$2" : "$1.$2"
    )
    .replaceAll(thousandSeperatorRegex, "$1$2")
    .replaceAll(decimalRegex, "$1.$2");
