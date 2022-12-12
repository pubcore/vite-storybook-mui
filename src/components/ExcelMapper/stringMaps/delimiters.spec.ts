import { delimiters } from "./delimiters";
import { numbers } from "./numbers";

//delimiterToPipe
const d2p = (s?: string | null) =>
  delimiters(s, {
    to: "|",
    numbers: (s) => numbers(s, { isEnglishNumberFormat: false }),
  });

//normalize delimiters
test("with comma", () => {
  expect(d2p("a,b")).toBe("a|b");
});
test("without delimiter", () => {
  expect(d2p("a")).toBe("a");
});
test("with whitespaces and ;", () => {
  expect(d2p("a b; xy")).toBe("a b| xy");
});
test("windows line breaks", () => {
  expect(d2p("apple,banana\r\norange ,lemon ,pumpkin\r\nbery")).toBe(
    "apple|banana|orange |lemon |pumpkin|bery"
  );
});
test("only linebreaks", () => {
  expect(d2p("one\ntwo\nthree")).toBe("one|two|three");
});
test("linebreak with delimiter value", () => {
  expect(d2p("one; onehundret;\nandone")).toBe("one| onehundret|andone");
});
test("empty string", () => {
  expect(d2p("")).toBe("");
});
test("undefined value", () => {
  expect(d2p(undefined)).toBe(undefined);
});
test("null value", () => {
  expect(d2p(null)).toBe(null);
});
test("tab separated", () => {
  expect(d2p("one\ttwo\tthree")).toBe("one|two|three");
});

//numbers, if comma is used as delimiter, a white-space character must follow
test("some numbers with comma", () => {
  expect(d2p("0.1, 0.3")).toBe("0.1| 0.3");
});
test("number without delimiter", () => {
  expect(d2p("0.235")).toBe("0.235");
});
test("german number format with comma (and whitespace)", () => {
  expect(d2p("2, 5,3, -45,4, -100.000,23")).toBe("2| 5.3| -45.4| -100000.23");
});
test("german number format with semicolon delimiter", () => {
  expect(d2p("200,45;12;1,0000001")).toBe("200.45|12|1.0000001");
});
test("numbers with thousand sep.", () => {
  expect(d2p("0.5, 200,200, 12,300.4")).toBe("0.5| 200200| 12300.4");
});
test("numbers with thousand sep., german format", () => {
  //beware, remove whitespaces is extra step (trim)
  expect(d2p("0,5, 200.200, 12.300,4")).toBe("0.5| 200200| 12300.4");
});
test("numbers with thousand sep., german format, semicolon", () => {
  expect(d2p("0,5;200.200;12.300,4")).toBe("0.5|200200|12300.4");
});
