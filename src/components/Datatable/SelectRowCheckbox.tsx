import { useCallback } from "react";
import { Checkbox } from "@mui/material";
import type { GetRowId } from "./DatatableTypes";

export function SelectRowCheckbox({
  toggleRowSelection,
  selectedRows,
  rowData,
  getRowId,
}: SelectRowProps) {
  const onChange = useCallback(
    ({ target: { checked } }: { target: { checked: boolean } }) => {
      toggleRowSelection && toggleRowSelection({ row: rowData, checked });
    },
    [toggleRowSelection, rowData]
  );
  const id = getRowId({ row: rowData });
  return (
    <Checkbox
      {...{
        "data-test": "olmekd#" + id,
        key: "olmekd#" + id,
        checked: selectedRows.has(id),
        onChange,
      }}
    />
  );
}

type Row = Record<string, unknown>;

export interface SelectRowProps {
  toggleRowSelection?: ({
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
