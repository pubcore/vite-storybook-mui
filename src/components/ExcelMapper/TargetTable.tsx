import { useMemo } from "react";
import { WorkBook } from "xlsx";
import { Datatable, DatatableProps } from "..";
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

  return (
    <>
      <Datatable {...{ title: "Target Table", rows, columns }} />
    </>
  );
}
