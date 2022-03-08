import { TextField } from "@mui/material";
import { useMemo } from "react";
import { WorkBook } from "xlsx";
import { Datatable, DatatableHeaderRowFilterProps, DatatableProps } from "..";
import { MappingsJson } from "./MappingsJson";
import { TargetRow } from "./maps/selectTargetRows";
import { selectTargetRows } from "./target/selectTargetRows";

export type TargetTableProps = {
  workbook: WorkBook;
  mappings: MappingsJson;
  save?: ({ rows }: { rows: TargetRow[] }) => void;
};

export function TargetTable({ workbook, mappings }: TargetTableProps) {
  const rows = selectTargetRows({ workbook, mappings });

  const columns = useMemo<DatatableProps["columns"]>(() => {
    return rows
      ? Object.keys(rows[0] ?? {}).reduce<
          NonNullable<DatatableProps["columns"]>
        >(
          (acc, col) =>
            acc.concat({
              name: col,
              width: 150,
              cellRenderer: ({ cellData }) => cellData?.value,
            }),
          []
        )
      : [];
  }, [rows]);

  const rowSort = useMemo(
    () =>
      columns?.reduce<NonNullable<DatatableProps["rowSort"]>>(
        (acc, { name }) => {
          acc[name] = textCompare;
          return acc;
        },
        {}
      ),
    [columns]
  );
  const rowFilter = useMemo(
    () =>
      columns?.reduce<NonNullable<DatatableProps["rowFilter"]>>(
        (acc, { name }) => {
          acc[name] = (props) => {
            return FilterText(props);
          };
          return acc;
        },
        {}
      ),
    [columns]
  );

  return (
    <>
      <Datatable
        {...{
          title: "Target Table",
          rows,
          columns,
          rowSort,
          cellVal,
          rowFilterMatch,
          rowFilter,
        }}
      />
    </>
  );
}

const cellVal = (row: Record<string, unknown>, key: string) => {
  return (row?.[key] as Record<string, unknown>)?.value;
};

const textCompare = (a: unknown, b: unknown) =>
  ("" + String(a ?? "")).localeCompare(String(b ?? ""), undefined, {
    numeric: true,
  });

const rowFilterMatch: DatatableProps["rowFilterMatch"] = ({ row, filter }) =>
  Object.entries(filter).every(
    ([key, value]) =>
      (!value && value !== 0) ||
      String((row[key] as Record<string, unknown>).value).includes(
        String(value)
      )
  );

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
