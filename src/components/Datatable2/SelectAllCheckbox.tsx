import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip, Checkbox } from "@mui/material";
import type { GetRowId } from "./DatatableTypes";

type Row = Record<string, unknown>;
type Rows = Row[];

export interface SelectAllCheckboxProps {
  toggleAllRowsSelection: ({
    rows,
    checked,
  }: {
    rows: Rows;
    checked: boolean;
  }) => void;
  rows: Rows;
  selectedRows: Set<ReturnType<GetRowId>>;
}

export default function SelectAllCheckbox({
  toggleAllRowsSelection,
  rows,
  selectedRows,
}: SelectAllCheckboxProps) {
  const onChange = useCallback(
    ({ target: { checked } }: { target: { checked: boolean } }) => {
      toggleAllRowsSelection({ rows, checked });
    },
    [rows, toggleAllRowsSelection]
  );
  const { t } = useTranslation();
  const textkey =
    selectedRows.size == rows.length
      ? "datatable_unselect_all_rows"
      : selectedRows.size == 0
      ? "datatable_select_all_rows"
      : "datatable_unselect_rows";
  return (
    <Tooltip title={t(textkey, { count: selectedRows.size })}>
      <Checkbox
        {...{
          id: "etdaaq",
          checked: selectedRows.size > 0,
          onChange,
        }}
      />
    </Tooltip>
  );
}
