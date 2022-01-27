import { Datatable, DatatableProps, DatatableHeaderRowFilterProps } from "../";
import { TextField } from "@mui/material";
import testRows from "./testRows.json";
import { action } from "@storybook/addon-actions";
const simulateRequestTime = 150; //ms
const loadRows = (count: number) =>
  (({ startIndex, stopIndex, filter, sorting }) => {
    return new Promise((res) =>
      setTimeout(() => {
        let rows = testRows.filter((row) =>
          filter?.name ? row.name.includes(filter.name as string) : true
        );
        if (sorting?.sortDirection) {
          rows = rows.sort((a, b) => (a.name < b.name ? -1 : 1));
        }
        if (sorting?.sortDirection === "DESC") {
          rows.reverse();
        }
        const n = stopIndex - startIndex + 1;
        //repeat test rows for counts over 10000
        res({
          rows: rows.slice(
            startIndex % 10000,
            (startIndex % 10000) + Math.min(n, count)
          ),
          count: filter?.name ? rows.length : count,
        });
      }, simulateRequestTime)
    );
  }) as DatatableProps["loadRows"];

type Args = DatatableProps;

const textCompare = (a: string, b: string) =>
  ("" + a ?? "").localeCompare(b ?? "", undefined, { numeric: true });

const FilterText = ({ name, changeFilter }: DatatableHeaderRowFilterProps) => (
  <TextField
    size="small"
    type="search"
    key={name}
    {...{
      name,
      onChange: ({ target }) => changeFilter(target),
      placeholder: "filter ...",
      autoComplete: "off",
    }}
  />
);

export default {
  title: "Datatable",
  args: {
    title: "List of fake addresses",
    loadRows: loadRows(5000),
    rowSort: {
      id: textCompare,
      name: textCompare,
      zip: textCompare,
      email: textCompare,
      city: textCompare,
    },
    rowSortServer: [],
    columns: [
      { name: "id", width: 40 },
      { name: "name", width: 150 },
      { name: "email", width: 250 },
      { name: "city", width: 150 },
      { name: "date", width: 200, flexGrow: 1 },
    ],
    rowFilter: {
      name(props) {
        return FilterText(props);
      },
      email(props) {
        return FilterText(props);
      },
      zip(props) {
        return FilterText(props);
      },
      city(props) {
        return FilterText(props);
      },
    },
    rowFilterServer: [],
    rowFilterMatch: ({ row, filter }) =>
      Object.entries(filter).every(
        ([key, value]) =>
          (!value && value !== 0) || String(row[key]).includes(String(value))
      ),
    loadAllUpTo: 5000,
    getRowId: ({ row: { id } }) => id,
  } as Args,
};

export const EmptyTable = () => <Datatable />,
  IndividualTitleComponent = () => (
    <Datatable
      title={
        <button type="button" onClick={() => alert("Hi, I'm a button")}>
          test
        </button>
      }
    />
  ),
  AllRowsLoaded = (args: Args) => <Datatable {...{ ...args }} />,
  SomeRowsLoadedNoServerSideFilterAvailable = (args: Args) => (
    <Datatable {...{ ...args, loadRows: loadRows(1000000) }} />
  ),
  SomeRowsLoadedWithServerSideFilterAndSort = (args: Args) => (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(1000000),
        rowFilterServer: ["name"],
        rowSortServer: ["name"],
      }}
    />
  ),
  BoundOnRowClick = (args: Args) => (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(10),
        onRowClick: action("onRowClick"),
      }}
    />
  ),
  RowSelectionImutable = (args: Args) => (
    <Datatable {...{ ...args, selectedRows: new Set([0, 1]) }} />
  ),
  RowSelection = (args: Args) => (
    <Datatable
      {...{
        ...args,
        selectedRows: new Set([0, 1]),
        toggleRowSelection: action("toggleRowSelection"),
      }}
    />
  ),
  RowSelectionWithToggleAllRowsHeader = (args: Args) => (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(2),
        selectedRows: new Set([0]),
        toggleRowSelection: action("toggleRowSelection"),
        toggleAllRowsSelection: action("toggleAllRowsSelection"),
      }}
    />
  );
