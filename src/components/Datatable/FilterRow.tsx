import { Box } from "@mui/material";
import { ReactNode } from "react";
import {
  DatatableColumn,
  DatatableProps,
  DatatableRow,
} from "./DatatableTypes";
import { marginWidth, StyledCell } from "./Row";

export function FilterRow<T extends DatatableRow>({
  visibleColumns,
  filterInputByName,
  columnsByName,
  isRowSelectionColEnabled,
}: FilterRowProps<T>) {
  return (
    <Box width={1} display="flex" alignItems="center" height={40}>
      {isRowSelectionColEnabled && (
        <div style={{ minWidth: 42, minHeight: 1 }} />
      )}
      {visibleColumns.map((colName, colIndex) => {
        const { width } = columnsByName.get(colName)!;
        return (
          <StyledCell
            key={`${colName}`}
            style={{
              marginLeft: colIndex === 0 ? marginWidth : "initial",
              minWidth: width,
              flex: `0 1 ${width}px`,
            }}
          >
            {filterInputByName.get(colName) ?? null}
          </StyledCell>
        );
      })}
    </Box>
  );
}

type FilterRowProps<T extends DatatableRow> = {
  visibleColumns: string[];
  columnsByName: Map<string, DatatableColumn>;
  filterInputByName: Map<string, ReactNode>;
  isRowSelectionColEnabled: boolean;
} & Pick<DatatableProps<T>, "rowFilter">;
