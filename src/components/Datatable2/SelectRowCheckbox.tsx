import { useCallback } from "react";
import { Checkbox, SxProps } from "@mui/material";
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
  sx?: SxProps;
}

export default function SelectRowCheckbox({
  rowIndex,
  toggleRowSelection,
  selectedRows,
  rowData,
  getRowId,
  sx,
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
        id: "olmekd_" + rowIndex,
        checked: selectedRows.has(getRowId({ row: rowData })),
        onChange,
        size: "small",
        sx,
      }}
    />
  );
}
