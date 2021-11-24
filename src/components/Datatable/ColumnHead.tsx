import React from "react";
import { TableSortLabel, TableSortLabelProps } from "@mui/material";
import type { TableHeaderRenderer } from "react-virtualized";

type SortDirection = TableSortLabelProps["direction"];

export interface ColumnHeadProps {
  dataKey: string;
  label?: string;
  sortBy: string;
  sortDirection?: SortDirection;
  disableSort?: boolean;
}

export default (function ColumnHead({
  dataKey,
  label,
  sortBy,
  sortDirection = "asc",
  disableSort,
}) {
  return (
    <span
      className="ReactVirtualized__Table__headerTruncatedText"
      key="label"
      title={typeof label === "string" ? label : undefined}
    >
      {disableSort ? (
        label
      ) : (
        <TableSortLabel
          active={dataKey === sortBy}
          direction={sortDirection.toLowerCase() as SortDirection}
        >
          {label}
        </TableSortLabel>
      )}
    </span>
  );
} as TableHeaderRenderer);
