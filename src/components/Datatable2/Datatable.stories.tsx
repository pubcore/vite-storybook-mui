import { DatatableHeaderRowFilterProps } from "../";
import { Datatable2 } from "./Datatable";
import { DatatableProps, DatatableRow } from "./DatatableTypes";
import { TextField } from "@mui/material";
import testRows from "./testRows.json";
import { action } from "@storybook/addon-actions";
import { useGenericRowRenderer } from "./useRowRenderer";

export default {
  title: "Datatable2/Table",
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
      {
        name: "date",
        width: 200,
        flexGrow: 1,
        cellRenderer: ({ cellData }) =>
          cellData && dateTimeFormat.format(new Date(cellData)),
      },
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

const simulateRequestTime = 150; //ms
function loadRows(count: number) {
  return (({ startIndex, stopIndex, filter, sorting }) => {
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
}

type Args = DatatableProps;

function textCompare(a: string, b: string) {
  return ("" + a ?? "").localeCompare(b ?? "", undefined, { numeric: true });
}

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

const dateTimeFormat = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "medium",
});

const _200_cols = new Array(200).fill(null).map((_, i) => i.toString());

export const EmptyTable = () => <Datatable2 />;
export const IndividualTitleComponent = () => (
  <Datatable2
    title={
      <button type="button" onClick={() => alert("Hi, I'm a button")}>
        test
      </button>
    }
  />
);
export const AllRowsLoaded = (args: Args) => <Datatable2 {...{ ...args }} />;
export const SomeRowsLoadedNoServerSideFilterAvailable = (args: Args) => (
  // visual glitch with jumping characters if items > ~250,000
  <Datatable2 {...{ ...args, loadRows: loadRows(250000) }} />
);
export const SomeRowsLoadedWithServerSideFilterAndSort = (args: Args) => (
  <Datatable2
    {...{
      ...args,
      loadRows: loadRows(250000),
      rowFilterServer: ["name"],
      rowSortServer: ["name"],
    }}
  />
);
export const BoundOnRowClick = (args: Args) => (
  <Datatable2
    {...{
      ...args,
      loadRows: loadRows(10),
      onRowClick: action("onRowClick"),
    }}
  />
);
export const RowSelectionImutable = (args: Args) => (
  <Datatable2 {...{ ...args, selectedRows: new Set([0, 1]) }} />
);
export const RowSelection = (args: Args) => (
  <Datatable2
    {...{
      ...args,
      selectedRows: new Set([0, 1]),
      toggleRowSelection: action("toggleRowSelection"),
    }}
  />
);
export const RowSelectionWithToggleAllRowsHeader = (args: Args) => (
  <Datatable2
    {...{
      ...args,
      loadRows: loadRows(2),
      selectedRows: new Set([0]),
      toggleRowSelection: action("toggleRowSelection"),
      toggleAllRowsSelection: action("toggleAllRowsSelection"),
    }}
  />
);
export const RowSelectionWithLocalStorage = (args: Args) => (
  <Datatable2
    {...{
      ...args,
      selectedRows: new Set([0, 1]),
      toggleRowSelection: action("toggleRowSelection"),
      storageId: "sb-datatable-1",
    }}
  />
);
export const _200_Columns = (args: Args) => {
  const rows: DatatableRow[] = _200_cols.map((v) => {
    const obj = _200_cols.reduce((a, c) => {
      a[`c${c}`] = String(Math.floor(Math.random() * 10) + 1);
      return a;
    }, {} as Record<string, string>);
    obj.name = `c${v}`;
    return obj;
  });
  return (
    <Datatable2
      {...{
        ...args,
        columns: _200_cols.map((v) => ({ name: `c${v}`, width: 50 })),
        // rows: _200_cols.map((v) => ({
        //   [`c${v}`]: String(Math.floor(Math.random() * 10) + 1),
        // })),
        rows,
        selectedRows: new Set(["c0", "c1"]),
        toggleRowSelection: action("toggleRowSelection"),
        rowFilter: undefined,
        toggleAllRowsSelection: action("toggleAllRowsSelection"),
      }}
    />
  );
};
