import { TableSortLabel } from "@mui/material";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import type { HeaderRowProps } from "./DatatableTypes";
import { marginWidth, StyledCell } from "./RowRenderer";
import SelectAllCheckbox from "./SelectAllCheckbox";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: 40,
};

export function HeaderRow({
  columns,
  visibleColumns,
  tableWidth: width,
  showFilter = false,
  rowFilter,
  changeFilter,
  sorting,
  rowSort,
  sort,
  disableSort,
  selectedRows,
  toggleAllRowsSelection,
  toggleRowSelection,
  rows,
}: HeaderRowProps) {
  const { t } = useTranslation();
  const headerElements = [
    selectedRows && (toggleRowSelection || toggleAllRowsSelection) ? (
      rows && toggleAllRowsSelection ? (
        <SelectAllCheckbox
          {...{
            selectedRows,
            toggleAllRowsSelection,
            rows,
            style: {
              flex: "0 1 42px",
            },
          }}
        />
      ) : selectedRows ? (
        <div style={{ minWidth: 42, minHeight: 1 }} />
      ) : null
    ) : null,
  ] as ReactNode[];

  const [lastSortedCol, setLastSortedCol] = useState<string | undefined>();

  visibleColumns.forEach((colName, colIndex) => {
    const col = columns.find((c) => c.name === colName);
    if (!col) return;

    const dataKey = col.dataKey ?? col.name;

    headerElements.push(
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
          <>{t(col.name as "_")}</>
        ) : (
          <TableSortLabel
            disabled={!rowSort?.[dataKey]}
            active={sorting?.sortBy !== undefined && dataKey === sorting.sortBy}
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
  });

  const filterElements: ReactNode[] = [];
  const filterRows = visibleColumns.map((columnName) => ({
    columnName,
    element: rowFilter?.[columnName] ?? null,
  }));

  visibleColumns.forEach((colName, colIndex) => {
    const col = columns.find((c) => c.name === colName);
    const itm = filterRows.find((i) => i.columnName === colName);

    if (!col || !itm) return;

    filterElements.push(
      <StyledCell
        key={`datatable_generic_row_column_${colName}`}
        style={{
          marginLeft: colIndex === 0 ? marginWidth : "initial",
          minWidth: col.width,
          flex: `0 1 ${col.width}px`,
        }}
      >
        {itm.element ? itm.element({ name: colName, changeFilter }) : null}
      </StyledCell>
    );
  });

  if (selectedRows && (toggleRowSelection || toggleAllRowsSelection))
    filterElements.unshift(<div style={{ minWidth: 42, minHeight: 1 }} />);

  return visibleColumns.length > 0 ? (
    <div style={{ marginBottom: 10, width }}>
      <div
        className="datatable_header_row"
        role="row"
        style={{
          width,
          ...defaultStyle,
        }}
      >
        {headerElements}
      </div>
      {showFilter && (
        <div
          className="datatable_filter_row"
          role="row"
          style={{
            width,
            ...defaultStyle,
          }}
        >
          {filterElements}
        </div>
      )}
    </div>
  ) : null;
}

function toggleSortDirection(direction?: string) {
  if (direction?.toUpperCase() === "ASC") return "DESC";
  return "ASC";
}
