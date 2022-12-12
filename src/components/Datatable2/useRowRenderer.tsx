import { TableSortLabel } from "@mui/material";
import { noop } from "lodash-es";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CellRenderer,
  ChangeFilter,
  DatatableColumn,
  DatatableProps,
  DatatableRow,
  HeaderRowProps,
  RowFilterFunction,
  RowsState,
} from "./DatatableTypes";

const emptyArray: unknown[] = [];
const marginWidth = 10;

/** Specifically renders data rows */
export function useRowRenderer({
  row,
  rowIndex,
  columns,
  visibleColumns,
}: {
  row?: DatatableRow;
  rowIndex: number;
  columns: DatatableColumn[];
  visibleColumns: string[];
}) {
  const elements = [...emptyArray] as ReactNode[];
  let left = 10;

  visibleColumns.forEach((columnName, colIndex) => {
    const col = columns.find((c) => c.name === columnName);
    const val = row?.[columnName];
    const renderer: CellRenderer =
      col?.cellRenderer ?? (({ cellData }) => String(cellData));

    if (!col || !val) return;

    elements.push(
      <div
        key={`datatable_row_${rowIndex}_column_${columnName}`}
        style={{
          position: "absolute",
          width: col.width,
          left,
          marginRight: marginWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginLeft: colIndex === 0 ? marginWidth : "initial",
        }}
        title={String(val)}
      >
        {renderer({
          cellData: val ? String(val) : undefined,
          rowIndex,
          columnIndex: colIndex,
        })}
      </div>
    );

    left += col.width + marginWidth * (colIndex === 0 ? 2 : 1);
  });

  return <>{elements}</>;
}

/** Specifically renders the header row */
export function useHeaderRowRenderer({
  columns,
  visibleColumns,
  sorting,
  disableSort,
  rowSort,
  sort,
}: {
  columns: DatatableColumn[];
  visibleColumns: string[];
  sorting?: RowsState["sorting"];
  disableSort?: boolean;
  rowSort: DatatableProps["rowSort"];
  sort: HeaderRowProps["sort"];
}) {
  const { t } = useTranslation();
  const elements = [...emptyArray] as ReactNode[];
  let left = 10;

  const [lastSortedCol, setLastSortedCol] = useState<string | undefined>();

  visibleColumns.forEach((colName, colIndex) => {
    const col = columns.find((c) => c.name === colName);
    if (!col) return;

    const dataKey = col.dataKey ?? col.name;

    elements.push(
      <div
        key={`datatable_header_row_column_${colName}`}
        style={{
          position: "absolute",
          width: col.width,
          left,
          marginRight: marginWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginLeft: colIndex === 0 ? marginWidth : "initial",
        }}
      >
        {disableSort === true ? (
          <div>{t(col.name as "_")}</div>
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
          >
            {t(col.name as "_")}
          </TableSortLabel>
        )}
      </div>
    );

    left += col.width + marginWidth * (colIndex === 0 ? 2 : 1);
  });

  return <>{elements}</>;
}

/** Miscellaneous row renderer for rows with custom elements (like filter) */
export function useGenericRowRenderer({
  columns,
  visibleColumns,
  items,
  changeFilter,
}: {
  columns: DatatableColumn[];
  visibleColumns: string[];
  items: { columnName: string; element: RowFilterFunction | null }[];
  changeFilter: ChangeFilter;
}) {
  const elements = [...emptyArray] as ReactNode[];
  let left = 10;

  visibleColumns.forEach((colName, colIndex) => {
    const col = columns.find((c) => c.name === colName);
    const itm = items.find((i) => i.columnName === colName);
    if (!col || !itm) return;

    elements.push(
      <div
        key={`datatable_generic_row_column_${colName}`}
        style={{
          position: "absolute",
          width: col.width,
          left,
          marginRight: marginWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginLeft: colIndex === 0 ? marginWidth : "initial",
        }}
      >
        {itm.element ? itm.element({ name: colName, changeFilter }) : null}
      </div>
    );

    left += col.width + marginWidth * (colIndex === 0 ? 2 : 1);
  });

  return <>{elements}</>;
}

function toggleSortDirection(direction?: string) {
  if (direction?.toUpperCase() === "ASC") return "DESC";
  return "ASC";
}
