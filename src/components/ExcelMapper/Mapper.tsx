import { ReactNode, useCallback, useMemo, useReducer, useState } from "react";
import { ActionButton, Datatable, DatatableProps, TooltipOnOverflow } from "..";
import { selectColumns, Source } from "./source";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LinkIcon from "@mui/icons-material/Link";
import { Divider, IconButton, Popover } from "@mui/material";
import { SelectColumns, SelectColumnsProps } from "./SelectColumns";
import { Targets } from "./target";
import { Columns } from "./source/Column";
import { InputCode } from "./InputCode";
import { selectIsSourceColumnFlagsOfTargetId } from "./maps/selectIsSourceColumnFlagsOfTargetId";
import update from "immutability-helper";
import { selectMappingIndexesByTargetId } from "./maps/selectMappingIndexesByTargetId";
import { debounce } from "lodash-es";
import { Row, selectRows } from "./maps/selectRows";
import { S, SourceIdColumns } from "./maps";
import { MappingsJson } from "./MappingsJson";
import { selectStateMappingsOfMappingsJson } from "./maps/selectStateMappingsOfMappingsJson";
import { selectMappingsJson } from "./maps/selectMappingsJson";
import { useTranslation } from "react-i18next";

export interface MapperProps {
  source: Source;
  title: ReactNode;
  targetColumns: Targets;
  targetIds: string[];
  mappings?: MappingsJson["mappings"];
  save?: (_: { mappings: MappingsJson["mappings"] }) => void;
}

export default function Mapper({
  source,
  title,
  targetColumns,
  targetIds,
  mappings,
  save,
}: MapperProps) {
  const { t } = useTranslation();
  const [pivot, setPivot] = useState<{
    anchorEl: Element;
    row: typeof rows[number];
  } | null>(null);

  const { anchorEl, row } = pivot ?? {};

  const [state, dispatch] = useReducer(
    reducer,
    { source, targetColumns, targetIds, mappings },
    init
  );

  const handleChangePipe = useMemo(
    () =>
      debounce(
        (event) =>
          dispatch({
            type: "changePipe",
            payload: { targetId: event.target.id, pipe: event.target.value },
          }),
        750
      ),
    []
  );

  const columns = useMemo<DatatableProps["columns"]>(
    () => [
      {
        name: "selectSource",
        width: 100,
        cellRenderer: ({ rowData }) => (
          <IconButton
            color="primary"
            size="small"
            onClick={({ currentTarget }) =>
              setPivot({ anchorEl: currentTarget, row: rowData })
            }
          >
            {rowData.sourceColumns?.length ? <LinkIcon /> : <AddLinkIcon />}
          </IconButton>
        ),
        style: { textAlign: "center" },
      },
      {
        name: "sourceColumns",
        width: 300,
        cellRenderer: ({ cellData }: { cellData?: Columns }) =>
          cellData?.map((col, index) => (
            <TooltipOnOverflow key={col.name + index}>
              {col.name}
            </TooltipOnOverflow>
          )),
      },
      {
        name: "pipe",
        width: 300,
        cellRenderer: ({ rowData }: { rowData: typeof rows[number] }) => (
          <InputCode
            id={rowData.targetColumnId}
            name="pipe"
            defaultValue={rowData?.pipe}
            onChange={handleChangePipe}
          />
        ),
      },
      { name: "targetColumnName", width: 300 },
      {
        name: "targetValues",
        width: 300,
        cellRenderer: ({ rowData }: { rowData: Row }) => (
          <TooltipOnOverflow>
            {Array.from(rowData.targetCellsById)
              .slice(0, 3)
              .map(
                ([, { value }], index) =>
                  (index > 0 ? ", " : "") + (value ?? "")
              )}
            {rowData.targetCellsById.size > 3 ? ", ..." : null}
          </TooltipOnOverflow>
        ),
      },
    ],
    [handleChangePipe]
  );

  const toggleColumn = useCallback<SelectColumnsProps["toggleColumn"]>(
    ({ page, column }) => {
      if (!row?.targetColumnId) return;
      dispatch({
        type: "toggleSourceColumn",
        payload: { page, column, targetId: row.targetColumnId },
      });
    },
    [row?.targetColumnId]
  );

  const rows = selectRows(state);

  return (
    <>
      <Datatable
        {...{
          title,
          rows,
          columns,
          manageColumns: false,
          rowHeight: 55,
        }}
      />
      <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
      {save && (
        <ActionButton
          onClick={() =>
            save({
              mappings: selectMappingsJson({
                mappings: state.mappings,
                targetIds,
              }).mappings,
            })
          }
        >
          {t("save_mappings", "ok")}
        </ActionButton>
      )}
      <Popover
        {...{
          open: Boolean(anchorEl),
          anchorEl,
          onClose: () => setPivot(null),
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
        }}
      >
        {row && (
          <SelectColumns
            {...{
              source,
              selectedColumns: selectIsSourceColumnFlagsOfTargetId(
                state,
                row.targetColumnId
              ),
              toggleColumn,
            }}
          />
        )}
      </Popover>
    </>
  );
}

function init({
  source,
  targetColumns,
  targetIds,
  mappings,
}: Pick<MapperProps, "source" | "targetColumns" | "targetIds" | "mappings">) {
  const [stateMappings, findings] =
    (mappings &&
      selectStateMappingsOfMappingsJson(
        {
          workbook: source.workbook,
          targetColumns,
        },
        mappings
      )) ??
    [];
  if (findings) {
    console.warn(findings);
  }
  const mappingsByTargetId = stateMappings?.reduce(
    (acc, mapping) => acc.set(mapping.target.id, mapping),
    new Map()
  );

  //this must depend on initial mapping property
  const sourceIdColumns = targetIds.reduce<SourceIdColumns>((acc, targetId) => {
    const sourceColumns =
      stateMappings &&
      stateMappings.find((mapping) => mapping.target.id === targetId)
        ?.sourceColumns;

    if (sourceColumns) {
      return acc.concat([sourceColumns]);
    } else {
      return acc;
    }
  }, []);

  return {
    workbook: source.workbook,
    targetColumns,
    targetIds,
    sourceIdColumns,
    mappings: targetColumns.map(
      (target) =>
        mappingsByTargetId?.get(target.id) ?? {
          sourceColumns: [],
          pipe: "",
          target,
        }
    ),
  };
}

export type Action =
  | {
      type: "toggleSourceColumn";
      payload: { page: number; column: number; targetId: string };
    }
  | { type: "changePipe"; payload: { targetId: string; pipe: string } };

function reducer(state: S, action: Action): S {
  switch (action.type) {
    case "toggleSourceColumn": {
      const { page, column, targetId } = action.payload;
      const col = selectColumns(state.workbook).columnsByPageindex[page][
        column
      ];
      const mappingIndex = selectMappingIndexesByTargetId(state).get(targetId);
      if (mappingIndex === undefined) return state;
      const columnIndex = state.mappings[mappingIndex].sourceColumns.findIndex(
        (column) => column === col
      );
      return update(state, {
        mappings: {
          [mappingIndex]: {
            sourceColumns:
              columnIndex >= 0
                ? { $splice: [[columnIndex, 1]] }
                : { $push: [col] },
          },
        },
      });
    }
    case "changePipe": {
      const { pipe, targetId } = action.payload;
      const index = selectMappingIndexesByTargetId(state).get(targetId);
      if (index === undefined) return state;
      return update(state, { mappings: { [index]: { pipe: { $set: pipe } } } });
    }
    default:
      return state;
  }
}
