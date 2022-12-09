import type { HeaderRowProps } from "./DatatableTypes";
import SelectAllCheckbox, { SelectAllCheckboxProps } from "./SelectAllCheckbox";
import { useHeaderRowRenderer } from "./useRowRenderer";

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
  selectedRows,
  rowFilter,
  changeFilter,
  toggleAllRowsSelection,
  rows,
  sorting,
  disableSort,
}: HeaderRowProps & SelectAllCheckboxProps) {
  const elements = useHeaderRowRenderer({
    columns,
    visibleColumns,
    sorting,
    disableSort,
  });

  return visibleColumns.length > 0 ? (
    <>
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
          {(selectedRows
            ? [
                <SelectAllCheckbox
                  key="_datatable_header_row_selection"
                  {...{ selectedRows, toggleAllRowsSelection, rows }}
                />,
              ]
            : []
          ).concat(
            visibleColumns.map((colName) => {
              // TODO
              const col = columns.find((c) => c.name === colName);
              if (!col) return <></>;

              const { flexGrow = 0, width, flexShrink = 1, name } = col;

              return (
                <div
                  key={`datatable_header_row_${name}`}
                  style={{
                    flex: `${flexGrow} ${flexShrink} ${width}px`,
                  }}
                >
                  {rowFilter?.[name]?.({ name, changeFilter }) ?? null}
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  ) : null;
}
