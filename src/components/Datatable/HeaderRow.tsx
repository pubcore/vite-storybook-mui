import type { HeaderRowProps } from "./DatatableTypes";
import { useGenericRowRenderer, useHeaderRowRenderer } from "./useRowRenderer";

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
  const headerElements = useHeaderRowRenderer({
    columns,
    visibleColumns,
    sorting,
    disableSort,
    rows,
    rowSort,
    sort,
    selectedRows,
    toggleAllRowsSelection,
    toggleRowSelection,
  });

  const filterElements = useGenericRowRenderer({
    columns,
    visibleColumns,
    changeFilter,
    rows: rowFilter
      ? visibleColumns.map((columnName) => ({
          columnName,
          element: rowFilter?.[columnName] ?? null,
        }))
      : [],
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
