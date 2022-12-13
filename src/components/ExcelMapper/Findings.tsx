import { groupBy } from "lodash-es";
import { useTranslation } from "react-i18next";
import { ObjectTable, SimpleTableCellProps } from "../";
import { Finding } from "./maps";
import { selectSeverities } from "./maps";

export type FindingsProps = {
  findings?: Finding[];
};

export function Findings({ findings }: FindingsProps) {
  const { errors } = selectSeverities({ findings });
  const o = groupBy(errors, "id");
  return (
    <ObjectTable
      {...{
        o,
        attributes: Object.keys(o),
        Cell: FeedbackCell,
        sx: { maxHeight: 300, overflowY: "auto" },
      }}
    />
  );
}

function FeedbackCell({ column, row }: SimpleTableCellProps) {
  const { t } = useTranslation();
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
              case "NO_COLUMN_FOUND":
                return t(
                  "mapping_no_column_found",
                  "No column is found in current file."
                );
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
          {value}
          {row["key"] === "NO_COLUMN_FOUND" ? (
            ""
          ) : (
            <>&nbsp;{`(${(row["value"] as []).length})`}</>
          )}
        </>
      );
    }
    default:
      return <></>;
  }
}
