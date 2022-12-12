import { TableSortLabel } from "@mui/material";
import { noop } from "lodash-es";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  CellRenderer,
  ChangeFilter,
  DatatableColumn,
  DatatableRow,
  HeaderRowProps,
  RowFilterFunction,
  RowsState,
} from "./DatatableTypes";

const emptyArray: unknown[] = [];
const marginWidth = 10;

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

  visibleColumns.forEach((columnName, columnIndex) => {
    const col = columns.find((c) => c.name === columnName);
    const val = row?.[columnName];
    const renderer: CellRenderer =
      col?.cellRenderer ?? (({ cellData }) => String(cellData));

    if (!col || !val) return;

    elements.push(
      <div
        key={`datatable_row_${rowIndex}_col_${col.name}`}
        style={{
          position: "absolute",
          width: col.width,
          left,
          marginRight: marginWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...(columnIndex === 0 ? { marginLeft: marginWidth } : {}),
        }}
        title={String(val)}
      >
        {renderer({
          cellData: val ? String(val) : undefined,
          rowIndex,
          columnIndex,
        })}
      </div>
    );

    left += col.width + marginWidth * (columnIndex === 0 ? 2 : 1);
  });

  return <>{elements}</>;
}

export function useHeaderRowRenderer({
  columns,
  visibleColumns,
  sorting,
  disableSort,
  sort,
}: {
  columns: DatatableColumn[];
  visibleColumns: string[];
  sorting?: RowsState["sorting"];
  disableSort?: boolean;
  sort: HeaderRowProps["sort"];
}) {
  const { t } = useTranslation();
  const elements = [...emptyArray] as ReactNode[];
  let left = 10;

  visibleColumns.forEach((colName, colIndex) => {
    const col = columns.find((c) => c.name === colName);
    if (!col) return;

    elements.push(
      <div
        key={`datatable_header_row_${col.name}`}
        style={{
          position: "absolute",
          width: col.width,
          left,
          marginRight: marginWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...(colIndex === 0 ? { marginLeft: marginWidth } : {}),
        }}
      >
        {disableSort === true ? (
          <div>{t(col.name as "_")}</div>
        ) : (
          <TableSortLabel
            active={
              sorting?.sortBy !== undefined && col.dataKey === sorting.sortBy
            }
            direction={
              sorting?.sortDirection?.toLowerCase() as
                | "desc"
                | "asc"
                | undefined
            }
            onClick={() =>
              sort
                ? sort({
                    sortBy: colName,
                    sortDirection: toggleSortDirection(sorting?.sortDirection),
                  })
                : undefined
            }
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
        key={`datatable_header_row_${col.name}`}
        style={{
          position: "absolute",
          width: col.width,
          left,
          marginRight: marginWidth,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...(colIndex === 0 ? { marginLeft: marginWidth } : {}),
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
