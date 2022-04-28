import type { HeaderRowProps } from "./DatatableTypes";

export default function HeaderRow({
  className,
  style,
  visibleColumns,
  columns,
  showFilter = false,
  selectedRows,
  rowFilter,
  changeFilter,
}: HeaderRowProps) {
  return visibleColumns.length > 0 ? (
    <>
      <div className={className} role="row" style={style}>
        {columns}
      </div>
      {showFilter && (
        <div className={className} role="row" style={style}>
          {(selectedRows
            ? [
                <div
                  key="_rowSelection"
                  className="ReactVirtualized__Table__headerColumn"
                  style={{
                    flex: `0 1 40px`,
                  }}
                />,
              ]
            : []
          ).concat(
            visibleColumns.map(
              ({ flexGrow = 0, width, flexShrink = 1, name }) => (
                <div
                  key={name}
                  className="ReactVirtualized__Table__headerColumn"
                  style={{
                    flex: `${flexGrow} ${flexShrink} ${width}px`,
                  }}
                >
                  {rowFilter?.[name]?.({ name, changeFilter }) ?? null}
                </div>
              )
            )
          )}
        </div>
      )}
    </>
  ) : null;
}
