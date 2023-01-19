import { styled, TableSortLabel } from "@mui/material";
import { CSSProperties, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CellRenderer,
  ChangeFilter,
  DatatableColumn,
  DatatableProps,
  DatatableRow,
  GetRowId,
  HeaderRowProps,
  RowFilterFunction,
  Rows,
  RowsState,
} from "./DatatableTypes";
import SelectAllCheckbox from "./SelectAllCheckbox";
import SelectRowCheckbox from "./SelectRowCheckbox";

const emptyArray: unknown[] = [];
const marginWidth = 10;

/** Specifically renders data rows */
export function useRowRenderer({
  row,
  rowIndex,
  columns,
  visibleColumns,
  selectedRows,
  toggleRowSelection,
  getRowId,
}: {
  row?: DatatableRow;
  rowIndex: number;
  columns: DatatableColumn[];
  visibleColumns: string[];
  selectedRows: DatatableProps["selectedRows"];
  toggleRowSelection: DatatableProps["toggleRowSelection"];
  getRowId: GetRowId;
}) {
  const elements = [...emptyArray] as ReactNode[];

  if (selectedRows && toggleRowSelection && row) {
    elements.push(
      <SelectRowCheckbox
        {...{
          rowIndex,
          rowData: row,
          toggleRowSelection,
          selectedRows,
          getRowId,
          style: {
            // position: "absolute",
            // left: left + 5,
            flex: "0 1 30px",
          },
        }}
      />
    );
  }

  visibleColumns.forEach((columnName, colIndex) => {
    const col = columns.find((c) => c.name === columnName);
    const val = row?.[columnName];
    const renderer: CellRenderer =
      col?.cellRenderer ?? (({ cellData }) => String(cellData));

    if (!col) return;

    const Cell = StyledCell({ flex: `0 1 ${col.width}px` });

    elements.push(
      <Cell
        key={`datatable_row_${rowIndex}_column_${columnName}`}
        style={{
          minWidth: col.width,
          marginLeft: colIndex === 0 ? marginWidth : "initial",
        }}
        title={val ? String(val) : undefined}
      >
        {val ? (
          renderer({
            cellData: String(val),
            rowIndex,
            columnIndex: colIndex,
          })
        ) : (
          <div
            style={{
              marginRight: marginWidth,
              marginLeft: colIndex === 0 ? marginWidth : "initial",
            }}
          ></div>
        )}
      </Cell>
    );
  });

  return <>{elements}</>;
}

/** Specifically renders the header row */
export function useHeaderRowRenderer({
  columns,
  visibleColumns,
  selectedRows,
  toggleAllRowsSelection,
  toggleRowSelection,
  sorting,
  disableSort,
  rows,
  rowSort,
  sort,
}: {
  columns: DatatableColumn[];
  visibleColumns: string[];
  selectedRows: DatatableProps["selectedRows"];
  toggleAllRowsSelection: DatatableProps["toggleAllRowsSelection"];
  toggleRowSelection: DatatableProps["toggleRowSelection"];
  sorting?: RowsState["sorting"];
  disableSort?: boolean;
  rows?: Rows;
  rowSort: DatatableProps["rowSort"];
  sort: HeaderRowProps["sort"];
}) {
  const { t } = useTranslation();
  const elements = [
    selectedRows && (toggleRowSelection || toggleAllRowsSelection) ? (
      rows ? (
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

    const Cell = StyledCell({ flex: `0 1 ${col.width}px` });
    const dataKey = col.dataKey ?? col.name;

    elements.push(
      <Cell
        key={`datatable_header_row_column_${colName}`}
        style={{
          marginLeft: colIndex === 0 ? marginWidth : "initial",
          position: "relative",
          whiteSpace: "nowrap",
          minWidth: col.width,
          maxWidth: col.width,
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
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                fontWeight: "bold",
              }}
            >
              {t(col.name as "_")}
            </span>
          </TableSortLabel>
        )}
      </Cell>
    );
  });

  return <>{elements}</>;
}

/** Miscellaneous row renderer for rows with custom elements (like filter) */
export function useGenericRowRenderer({
  columns,
  visibleColumns,
  rows,
  changeFilter,
}: {
  columns: DatatableColumn[];
  visibleColumns: string[];
  rows: { columnName: string; element: RowFilterFunction | null }[];
  changeFilter: ChangeFilter;
}) {
  const elements = [...emptyArray] as ReactNode[];

  visibleColumns.forEach((colName, colIndex) => {
    const col = columns.find((c) => c.name === colName);
    const itm = rows.find((i) => i.columnName === colName);

    if (!col || !itm) return;

    const Cell = StyledCell({ flex: `0 1 ${col.width}px` });

    elements.push(
      <Cell
        key={`datatable_generic_row_column_${colName}`}
        style={{
          marginLeft: colIndex === 0 ? marginWidth : "initial",
          minWidth: col.width,
        }}
      >
        {itm.element ? itm.element({ name: colName, changeFilter }) : null}
      </Cell>
    );
  });

  return elements;
}

function StyledCell(additionalStyle: CSSProperties) {
  return styled("div")({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: marginWidth,
    minHeight: 1, // otherwise empty cells are rendered with 0 width
    ...additionalStyle,
  });
}

function toggleSortDirection(direction?: string) {
  if (direction?.toUpperCase() === "ASC") return "DESC";
  return "ASC";
}
