import { Box, TableSortLabel } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DatatableRow, HeaderRowProps } from "./DatatableTypes";
import { FilterRow } from "./FilterRow";
import { marginWidth, StyledCell } from "./RowRenderer";
import { SelectAllCheckbox } from "./SelectAllCheckbox";

export function HeaderRow<T extends DatatableRow>({
  columns,
  visibleColumns,
  showFilter = false,
  rowFilter,
  changeFilter,
  sorting,
  rowSort,
  sort,
  disableSort,
  selectedRows,
  toggleAllRowsSelection,
  rows,
}: HeaderRowProps<T>) {
  const { t } = useTranslation();
  const columnsByName = useMemo(
    () => columns.reduce((acc, col) => acc.set(col.name, col), new Map()),
    [columns]
  );

  const [lastSortedCol, setLastSortedCol] = useState<string | undefined>();

  const filterInputByName = useMemo(() => {
    return Object.entries(rowFilter ?? {}).reduce(
      (acc, [name, render]) =>
        acc.set(name, render ? render({ name, changeFilter }) : null),
      new Map()
    );
  }, [changeFilter, rowFilter]);

  const isRowSelectionColEnabled = useMemo(
    () => Boolean(selectedRows && rows),
    [rows, selectedRows]
  );

  return visibleColumns.length > 0 ? (
    <Box marginBottom={1} width={1}>
      <Box display="flex" alignItems="center" height={40} width={1}>
        {isRowSelectionColEnabled &&
          (toggleAllRowsSelection ? (
            <SelectAllCheckbox
              {...{
                selectedRows: selectedRows!,
                toggleAllRowsSelection,
                rows: rows!,
                style: {
                  flex: "0 1 42px",
                },
              }}
            />
          ) : (
            <div style={{ minWidth: 42, minHeight: 1 }} />
          ))}
        {visibleColumns.map((colName, colIndex) => {
          const col = columnsByName.get(colName);
          if (!col) return null;
          const dataKey = col.dataKey ?? col.name;
          return (
            <StyledCell
              key={`datatable_header_row_column_${colName}`}
              style={{
                marginLeft: colIndex === 0 ? marginWidth : "initial",
                position: "relative",
                whiteSpace: "nowrap",
                minWidth: col.width,
                maxWidth: col.width,
                fontWeight: "bold",
                flex: `0 1 ${col.width}px`,
              }}
            >
              {disableSort === true ? (
                <div
                  style={{
                    maxWidth: col.width,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  title={t(col.name as "_")}
                >
                  {t(col.name as "_")}
                </div>
              ) : (
                <TableSortLabel
                  disabled={!rowSort?.[dataKey]}
                  active={
                    sorting?.sortBy !== undefined && dataKey === sorting.sortBy
                  }
                  direction={
                    sorting?.sortDirection?.toLowerCase() as
                      | "desc"
                      | "asc"
                      | undefined
                  }
                  onClick={() => {
                    if (sort) {
                      sort({
                        sortBy: colName,
                        sortDirection:
                          colName === lastSortedCol
                            ? toggleSortDirection(sorting?.sortDirection)
                            : "ASC",
                      });
                      setLastSortedCol(colName);
                    }
                  }}
                  sx={{
                    maxWidth: col.width,
                  }}
                  title={t(col.name as "_")}
                >
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {t(col.name as "_")}
                  </div>
                </TableSortLabel>
              )}
            </StyledCell>
          );
        })}
      </Box>
      {showFilter && (
        <FilterRow
          {...{
            columnsByName,
            filterInputByName,
            visibleColumns,
            rowFilter,
            isRowSelectionColEnabled,
          }}
        />
      )}
    </Box>
  ) : null;
}

function toggleSortDirection(direction?: string) {
  if (direction?.toUpperCase() === "ASC") return "DESC";
  return "ASC";
}
