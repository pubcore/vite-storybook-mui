import { DatatableProps, RowFilterFunction } from "./DatatableTypes";

export const rowFilterMatch: DatatableProps["rowFilterMatch"] = ({
  row,
  filter,
  cellVal,
}) => {
  return Object.entries(filter).every(
    ([key, value]) =>
      (!value && value !== 0) ||
      String(cellVal).toLowerCase().includes(String(value).toLowerCase())
  );
};
