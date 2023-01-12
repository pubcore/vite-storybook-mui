import { Datatable, DatatableProps, DatatableHeaderRowFilterProps } from "../";
import { TextField } from "@mui/material";
import testRows from "./testRows.json";
import { action } from "@storybook/addon-actions";
import { useEffect, useState } from "react";
const simulateRequestTime = 150; //ms
const loadRows = (count: number, offset = 0) =>
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
            (startIndex + offset) % 10000,
            ((startIndex + offset) % 10000) + Math.min(n, count)
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
  title: "Datatable/Table",
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

const _200_cols = new Array(200).fill(null).map((_, i) => i.toString());

export const EmptyTable = () => <Datatable />;
export const IndividualTitleComponent = () => (
  <Datatable
    title={
      <button type="button" onClick={() => alert("Hi, I'm a button")}>
        test
      </button>
    }
  />
);
export const AllRowsLoaded = (args: Args) => <Datatable {...{ ...args }} />;

//Component to simulate updating/reload of rows
function LoadRows_Prop_Changes(args: Args) {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    let isMounted = true;
    const intervall = setInterval(() => {
      isMounted && setCounter((s) => s + 1);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervall);
    };
  }, []);
  return (
    <Datatable
      {...{
        ...args,
        loadRows: loadRows(1000, counter * 10),
        title: `Rows changed ${counter} times`,
      }}
    />
  );
}
export const SortOrFilterIsStillAppliedIfRowsHasChanged = (args: Args) => (
  <LoadRows_Prop_Changes {...{ ...args }} />
);

export const SomeRowsLoadedNoServerSideFilterAvailable = (args: Args) => (
  <Datatable {...{ ...args, loadRows: loadRows(1000000) }} />
);
export const SomeRowsLoadedWithServerSideFilterAndSort = (args: Args) => (
  <Datatable
    {...{
      ...args,
      loadRows: loadRows(1000000),
      rowFilterServer: ["name"],
      rowSortServer: ["name"],
    }}
  />
);
export const BoundOnRowClick = (args: Args) => (
  <Datatable
    {...{
      ...args,
      loadRows: loadRows(10),
      onRowClick: action("onRowClick"),
    }}
  />
);
export const RowSelectionImutable = (args: Args) => (
  <Datatable {...{ ...args, selectedRows: new Set([0, 1]) }} />
);
export const RowSelection = (args: Args) => (
  <Datatable
    {...{
      ...args,
      selectedRows: new Set([0, 1]),
      toggleRowSelection: action("toggleRowSelection"),
    }}
  />
);
export const RowSelectionWithToggleAllRowsHeader = (args: Args) => (
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
export const ManagedColumnsSavedToLocalStorage = (args: Args) => (
  <Datatable
    {...{
      ...args,
      storageId: "sb-datatable-1",
      columns: [
        { name: "id", width: 40 },
        { name: "name", width: 150 },
      ],
    }}
  />
);
//If static "columns" changes, potential selected columns must change
export const ManagedColumnsSavedToLocalStorageAndColumnsChange = (
  args: Args
) => (
  <Datatable
    {...{
      ...args,
      //To simulate test scenario, must have same storage-id like previous story
      storageId: "sb-datatable-1",
      //One column removed, and one added, compared to previuos story
      columns: [
        { name: "date", width: 150 },
        { name: "id", width: 40 },
      ],
    }}
  />
);

export const _200_Columns = (args: Args) => (
  <Datatable
    {...{
      ...args,
      columns: _200_cols.map((v) => ({ name: `c${v}`, width: 50 })),
      rows: _200_cols.map((v) => ({
        [`c${v}`]: String(Math.floor(Math.random() * 10) + 1),
      })),
      selectedRows: new Set(["c0", "c1"]),
      toggleRowSelection: action("toggleRowSelection"),
    }}
  />
);
export const DownloadCsv = (args: Args) => (
  <Datatable
    {...{
      ...args,
      loadRows: loadRows(10000),
      rowFilterServer: ["name"],
      rowSortServer: ["name"],
      downloadCsv: true,
      downloadCsvFilename: "datatable-test",
      downloadCsvTransforms: [
        (row) => {
          const { date, ...rest } = (row ?? {}) as Record<string, unknown>;
          return rest;
        },
      ],
    }}
  />
);
