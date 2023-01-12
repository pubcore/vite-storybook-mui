import ColumnsSelector, { ColumnsSelectorProps } from "./";
import ColumnsOverview from "./ColumnsOverview";
import { action } from "@storybook/addon-actions";

const defaultColSequence = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
];

export default {
  title: "Datatable/columns selector",
  argTypes: {
    setSelected: { action: { name: "setSelected" } },
    setSequence: { action: { name: "setSequence" } },
    resetSequence: { action: { name: "resetSequence" } },
  },
  args: {
    selected: ["one", "two"],
    columnsSequence: defaultColSequence,
    setSequence: action("setSequence"),
    columns: [
      {
        name: "one",
        width: 60,
        label: "lb_one",
      },
      {
        name: "two",
        width: 60,
        label: "lb_two",
      },
      {
        name: "three",
        width: 60,
      },
      {
        name: "four",
        width: 60,
        label: "Drei", //duplicate label should lead to "Drei (four)"
      },
    ],
  },
};

function randomSelected(columns: string[]) {
  return columns.filter(() => Math.floor(Math.random() * 2) === 1);
}

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

const _200_cols = new Array(200).fill(null).map((_, i) => i.toString());
const _11_cols = [...defaultColSequence, "eight", "nine", "ten", "eleven"];

export const Default = (args: Args) => (
    <ColumnsSelector
      {...{ ...args, rows, selected: randomSelected(defaultColSequence) }}
    />
  ),
  WithFilter = (args: Args) => (
    <ColumnsSelector
      {...{
        ...args,
        columnsSequence: _11_cols,
        selected: randomSelected([
          ...defaultColSequence,
          "eight",
          "nine",
          "ten",
          "eleven",
        ]),
      }}
    />
  ),
  HundredsOfColumns = (args: Args) => (
    <ColumnsSelector
      {...{
        ...args,
        columnsSequence: _200_cols,
        selected: _200_cols,
      }}
    />
  ),
  ColumnsOverviewAlone = (args: Args) => (
    <ColumnsOverview
      {...{
        ...args,
        columnsSequence: _11_cols,
        currentCol: "six",
      }}
    ></ColumnsOverview>
  );
