import ColumnsSelector, { ColumnsSelectorProps } from "./";
const columns = ["one", "two", "three", "for", "five", "six", "seven"];
export default {
  title: "columns selector",
  argTypes: {
    setSelected: { action: { name: "setSelected" } },
    setSequence: { action: { name: "setSequence" } },
  },
  args: {
    selected: ["one", "two"],
    columns,
  },
};

type Args = ColumnsSelectorProps;

const rows = [
  {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    this_is_a_longer_key: 8,
    "dot.seperated.key": 9,
  },
];

export const Default = (args: Args) => (
    <ColumnsSelector {...{ ...args, rows }} />
  ),
  WithFilter = (args: Args) => (
    <ColumnsSelector
      {...{ ...args, columns: [...columns, "eight", "nine", "ten", "eleven"] }}
    />
  );
