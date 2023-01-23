import { styled } from "@mui/material";
import { ReactNode, useCallback } from "react";
import { ListChildComponentProps } from "react-window";
import {
  CellRenderer,
  DatatableProps,
  DatatableRow,
  GetRowId,
} from "./DatatableTypes";
import SelectRowCheckbox from "./SelectRowCheckbox";

const marginWidth = 10;

type RowRendererProps<T extends DatatableRow> = ListChildComponentProps &
  Required<Pick<DatatableProps<T>, "rows" | "rowHeight" | "columns">> & {
    selectedRows: DatatableProps<T>["selectedRows"];
    visibleColumns: string[];
    toggleAllRowsSelection: DatatableProps<T>["toggleAllRowsSelection"];
    toggleRowSelection: DatatableProps<T>["toggleRowSelection"];
    getRowId: GetRowId;
    onRowClick: DatatableProps<T>["onRowClick"];
  };

export function RowRenderer<T extends DatatableRow>({
  index: rowIndex,
  style,
  rows,
  rowHeight,
  columns,
  visibleColumns,
  selectedRows,
  toggleRowSelection,
  getRowId,
  onRowClick,
}: RowRendererProps<T>) {
  const row = rows[rowIndex]!;

  const rowElements: ReactNode[] = [];

  if (selectedRows && toggleRowSelection && row) {
    rowElements.push(
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

    rowElements.push(
      <StyledCell
        key={`datatable_row_${rowIndex}_column_${columnName}`}
        style={{
          minWidth: col.width,
          marginLeft: colIndex === 0 ? marginWidth : "initial",
          flex: `0 1 ${col.width}px`,
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
      </StyledCell>
    );
  });

  const handleRowClick = useCallback(() => {
    onRowClick && onRowClick({ rowData: row });
  }, [onRowClick, row]);

  return row ? (
    <StyledRow
      onClick={handleRowClick}
      style={{
        ...style,
        height: rowHeight,
        cursor: onRowClick ? "pointer" : "initial",
      }}
    >
      {rowElements}
    </StyledRow>
  ) : null;
}

const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledCell = styled("div")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginRight: marginWidth,
  minHeight: 1, // otherwise empty cells are rendered with 0 width
});
