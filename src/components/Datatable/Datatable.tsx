import type { DatatableProps } from "./DatatableTypes";
import { Container } from "./Container";

/**
 * Infinitely scrolling and paginated table that is filterable, sortable and supports async and static data loading
 * @template T Datatable row type
 */
export function Datatable({
  minPageSize = 3,
  headerHeight = 40,
  rowHeight = 30,
  ...rest
}: DatatableProps) {
  return (
    <Container
      {...{
        headerHeight,
        minPageSize,
        rowHeight,
        ...rest,
      }}
    />
  );
}
