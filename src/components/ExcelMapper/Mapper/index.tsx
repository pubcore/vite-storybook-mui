import { ReactNode, useCallback, useMemo, useReducer, useState } from "react";
import { ActionButton, Datatable, TooltipOnOverflow } from "../../";
import type { DatatableProps } from "../../";
import { Source } from "../source";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LinkIcon from "@mui/icons-material/Link";
import { Divider, IconButton, Popover } from "@mui/material";
import { SelectColumns, SelectColumnsProps } from "../SelectColumns";
import { Targets } from "../target";
import { Columns } from "../source/Column";
import { InputCode } from "../InputCode";
import { selectIsSourceColumnFlagsOfTargetId } from "../maps/selectIsSourceColumnFlagsOfTargetId";
import { debounce } from "lodash-es";
import { Row, selectRows } from "../maps/selectRows";
import { MappingsJson } from "../MappingsJson";
import { selectMappingsJson } from "../maps/selectMappingsJson";
import { useTranslation } from "react-i18next";
import { selectPagesByIndex } from "../source/selectPageByIndex";
import { reducer } from "./reducer";
import { init } from "./init";

export interface MapperProps {
  source: Source;
  title: ReactNode;
  targetColumns: Targets;
  targetIds: string[];
  mappings?: MappingsJson["mappings"];
  save?: (_: { mappings: MappingsJson["mappings"] }) => void;
  options?: { datatable?: DatatableProps };
}

export default function Mapper({
  source,
  title,
  targetColumns,
  targetIds,
  mappings,
  save,
  options,
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
          cellData?.map((col, index) => {
            const pagesByIndex = selectPagesByIndex(source.workbook);
            const pageName = pagesByIndex.size ? (
              <b>{pagesByIndex.get(col.pageIndex)?.name}&nbsp;</b>
            ) : (
              ""
            );
            return (
              <TooltipOnOverflow key={col.name + index}>
                {pageName}
                {col.name}
              </TooltipOnOverflow>
            );
          }),
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
    [handleChangePipe, source.workbook]
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
          rowHeight: 55,
          ...(options?.datatable ?? {}),
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
