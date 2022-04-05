import { groupBy } from "lodash-es";
import { ObjectTable, SimpleTableCellProps } from "../";
import { Finding } from "./maps";
import { selectSeverities } from "./maps";

export type FindingsProps = {
  findings?: Finding[];
};

export function Findings({ findings }: FindingsProps) {
  const { errors } = selectSeverities({ findings });
  return (
    <ObjectTable
      {...{
        o: groupBy(errors, "id"),
        get attributes() {
          return Object.keys(this.o);
        },
        Cell: FeedbackCell,
        sx: { maxHeight: 300, overflowY: "auto" },
      }}
    />
  );
}

function FeedbackCell({ column, row }: SimpleTableCellProps) {
  const value = row[column];
  switch (column) {
    case "value": {
      return (
        <>
          {(value as Finding[])?.map((finding, i) => {
            const comma = i > 0 ? ", " : "";
            switch (finding.id) {
              case "COLUMN_NOT_FOUND":
                return comma + finding.payload.id;
              case "MAPPED_COLUMN_NOT_FOUND":
                return comma + finding.payload.name;
              case "TARGET_NOT_FOUND":
                return comma + finding.payload.targetId;
              default:
                break;
            }
          })}
        </>
      );
    }
    case "key": {
      return (
        <>
          {value}&nbsp;({(row["value"] as []).length}):
        </>
      );
    }
    default:
      return <></>;
  }
}
