import { useMemo } from "react";
import type { DatatableColumn } from "./DatatableTypes";

export function useVisibleColumns({
  columns = [],
  columnsSequence,
  serverMode,
  rowSortServer,
  rowSort,
  selectedColumns,
}: UseVisiblColumnsArgs) {
  const visibleColumns: DatatableColumn[] = useMemo(() => {
    const columnsMap = columns.reduce(
      (acc, { name, ...rest }) => acc.set(name, rest),
      new Map()
    );
    return columnsSequence.reduce(
      (acc, name) =>
        selectedColumns.includes(name)
          ? acc.concat({
              name,
              width: 150,
              disableSort: serverMode
                ? !rowSortServer?.includes(name)
                : !rowSort?.[name],
              cellRenderer: defaultCellRenderer,
              ...columnsMap.get(name),
            })
          : acc,
      []
    );
  }, [
    columns,
    columnsSequence,
    serverMode,
    rowSortServer,
    rowSort,
    selectedColumns,
  ]);

  return {
    visibleColumns,
  };
}

function defaultCellRenderer({ cellData }: TableCellProps) {
  try {
    if (typeof cellData === "undefined") return "";
    return typeof cellData === "object"
      ? JSON.stringify(cellData)
      : String(cellData);
  } catch (err) {
    console.warn(err);
    return String(cellData);
  }
}

export interface UseVisiblColumnsArgs {
  columns?: DatatableColumn[];
  columnsSequence: string[];
  serverMode: boolean;
  rowSortServer?: string[];
  rowSort?: Record<string, unknown>;
  selectedColumns: string[];
}
