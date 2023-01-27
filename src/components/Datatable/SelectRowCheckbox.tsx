import { useCallback } from "react";
import { Checkbox } from "@mui/material";
import type { GetRowId } from "./DatatableTypes";

type Row = Record<string, unknown>;

export interface SelectRowProps {
  rowIndex: number;
  toggleRowSelection: ({
    row,
    checked,
  }: {
    row: Row;
    checked: boolean;
  }) => void;
  selectedRows: Set<ReturnType<GetRowId>>;
  rowData: Row;
  getRowId: GetRowId;
}

export function SelectRowCheckbox({
  rowIndex,
  toggleRowSelection,
  selectedRows,
  rowData,
  getRowId,
}: SelectRowProps) {
  const onChange = useCallback(
    ({ target: { checked } }: { target: { checked: boolean } }) => {
      toggleRowSelection({ row: rowData, checked });
    },
    [toggleRowSelection, rowData]
  );
  return (
    <Checkbox
      {...{
        id: "olmekd#" + rowIndex,
        checked: selectedRows.has(getRowId({ row: rowData })),
        onChange,
      }}
    />
  );
}
