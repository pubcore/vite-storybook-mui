import { stringPipe } from "./stringPipe";

test("Default pipe, returns first value", () => {
  expect(stringPipe("", ["foo"])).toBe("foo");
});

test("Value of first linked source columm's cell is available by $1", () => {
  expect(stringPipe("$1+'bar'", ["foo"])).toBe("foobar");
});

test("Any parse errors of pipe-string is catched", () => {
  expect(() => {
    return stringPipe("invalid javascript", []);
  }).not.toThrowError();
});
