import { SimpleTable } from "../";
import { useTranslation } from "react-i18next";
import { TableProps } from "@mui/material";

const Cell = (({ row, column }) => {
  const { t } = useTranslation();
  switch (column) {
    case "key":
      return (
        t((row.name + "_" + String(row[column]).replace(".", "_")) as "_") + ":"
      );
    default:
      return typeof row[column] === "object"
        ? Object.values(row[column] as Record<string, string>).map((val) => (
            <div key={val}>{val}</div>
          ))
        : row[column];
  }
}) as React.FC<{
  row: Record<string, unknown>;
  column: string;
}>;

const columns = ["key", "value"];
const emptyArray: string[] = [];

export interface ObjectTableProps extends Partial<TableProps> {
  o: Record<string, unknown>;
  attributes: string[];
  name?: string;
}

export default function ObjectTable({
  o,
  attributes = emptyArray,
  name = "table",
  ...rest
}: ObjectTableProps) {
  const rows = attributes.reduce(
    (acc, attr) =>
      acc.concat([
        {
          key: attr,
          value:
            attr
              .split(".")
              .reduce(
                (acc2, part) => acc2 && (acc2[part] as Record<string, unknown>),
                o
              ) ?? "",
          name,
          o,
        },
      ]),
    [] as Record<string, unknown>[]
  );
  return <SimpleTable id="agpkhn" {...{ rows, columns, Cell, ...rest }} />;
}
