import { styled } from "@mui/material";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  DatatableCellRenderer,
  DatatableProps,
  DatatableRow,
  GetRowId,
} from "./DatatableTypes";
import { SelectRowCheckbox } from "./SelectRowCheckbox";

export const marginWidth = 10;

type RowProps<T extends DatatableRow> = Required<
  Pick<DatatableProps<T>, "rows" | "columns">
> & {
  index: number;
  selectedRows: DatatableProps<T>["selectedRows"];
  visibleColumns: string[];
  toggleAllRowsSelection: DatatableProps<T>["toggleAllRowsSelection"];
  toggleRowSelection: DatatableProps<T>["toggleRowSelection"];
  getRowId: GetRowId;
  onRowClick: DatatableProps<T>["onRowClick"];
  style: CSSProperties;
};

export function Row<T extends DatatableRow = DatatableRow>({
  index: rowIndex,
  rows,
  columns,
  visibleColumns,
  selectedRows,
  toggleRowSelection,
  getRowId,
  onRowClick,
  style,
}: RowProps<T>) {
  const row = rows[rowIndex]!;
  const handleRowClick = useCallback(() => {
    onRowClick && onRowClick({ rowData: row });
  }, [onRowClick, row]);

  const id = row ? getRowId({ row }) : "";

  return id === "" ? (
    <div style={style}></div>
  ) : (
    <RowContainer
      className={onRowClick ? "clickable" : undefined}
      onClick={handleRowClick}
      style={style}
    >
      {selectedRows && (
        <SelectRowCheckbox
          {...{
            rowIndex,
            rowData: row,
            toggleRowSelection,
            selectedRows,
            getRowId,
          }}
        />
      )}
      {visibleColumns.map((columnName, colIndex) => {
        const col = columns.find((c) => c.name === columnName);
        const val = row?.[columnName];
        const renderer: DatatableCellRenderer<typeof row> =
          col?.cellRenderer ?? (({ cellData }) => String(cellData));

        if (!col) return null;

        const renderedVal = val
          ? renderer({
              columnName: columnName,
              columnIndex: colIndex,
              cellData: String(val),
              rowIndex,
              rowData: row,
            })
          : undefined;

        return (
          <StyledCell
            key={`datatable_row_${id}_column_${columnName}`}
            style={{
              minWidth: col.width,
              marginLeft: colIndex === 0 ? marginWidth : "initial",
              flex: `0 1 ${col.width}px`,
            }}
            title={
              renderedVal && typeof renderedVal !== "object"
                ? renderedVal.toString()
                : undefined
            }
          >
            {val && renderedVal ? (
              renderedVal
            ) : (
              <div
                style={{
                  marginRight: marginWidth,
                  marginLeft: colIndex === 0 ? marginWidth : "initial",
                }}
              ></div>
            )}
          </StyledCell>
        );
      })}
    </RowContainer>
  );
}

const RowContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "initial",
  "&.clickable": {
    cursor: "pointer",
  },
}));

export const StyledCell = styled("div")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginRight: marginWidth,
  minHeight: 1, // otherwise empty cells are rendered with 0 width
});
