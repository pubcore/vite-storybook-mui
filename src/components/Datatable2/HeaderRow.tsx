import type { HeaderRowProps } from "./DatatableTypes";
import SelectAllCheckbox, { SelectAllCheckboxProps } from "./SelectAllCheckbox";
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
  sort,
  disableSort,
}: HeaderRowProps & SelectAllCheckboxProps) {
  const elements = useHeaderRowRenderer({
    columns,
    visibleColumns,
    sorting,
    disableSort,
    sort,
  });

  const filterElements = useGenericRowRenderer({
    columns,
    visibleColumns,
    changeFilter,
    items: rowFilter
      ? visibleColumns.map((columnName) => ({
          columnName,
          element: rowFilter?.[columnName] ?? null,
        }))
      : [],
  });

  return visibleColumns.length > 0 ? (
    <div style={{ marginBottom: 10 }}>
      <div
        className="datatable_header_row"
        role="row"
        style={{
          width,
          ...defaultStyle,
        }}
      >
        {elements}
      </div>
      {showFilter && (
        <div
          className="datatable_header_row"
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
