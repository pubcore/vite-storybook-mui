import { useCallback, useReducer } from "react";
import { ActionButton, DatatableProps, FileUpload, FileUploadProps } from "../";
import XLSX, { WorkBook } from "xlsx";
import WorkbookTeaser from "./WorkbookTeaser";
import { Divider } from "@mui/material";
import Mapper, { MapperProps } from "./Mapper";
import { selectSource } from "./source";
import { KeyColumns, KeyColumnsProps } from "./KeyColumns";
import { MappingsJson } from "./MappingsJson";
import { useTranslation } from "react-i18next";
import { TargetTable } from "./TargetTable";
import { TargetRow } from "./maps/selectTargetRows";
import { selectTargetRows } from "./target/selectTargetRows";
import { init } from "./init";
import { reducer } from "./reducer";
import { selectMappings } from "./maps/selectMappings";

export interface ExcelMapperProps {
  targetColumns: MapperProps["targetColumns"];
  keyIds: string[];
  mappings?: MappingsJson;
  workbook?: WorkBook;
  save?: ({ mappings }: { mappings: MappingsJson }) => void;
  saveTargetTable?: ({
    rows,
    workbookFileName,
  }: {
    rows: TargetRow[];
    workbookFileName?: string;
  }) => void;
  options?: {
    mapper?: { datatable?: DatatableProps };
    previewTargetTable?: boolean;
  };
}

export default function ExcelMapper(props: ExcelMapperProps) {
  const {
    targetColumns,
    keyIds,
    mappings: mappingsDefault,
    save,
    saveTargetTable,
    options,
  } = props;
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, props, init);
  const { workbook, workbookFileName, mappings: mappingsDraft, step } = state;

  const handleFile: FileUploadProps["handleFile"] = useCallback(
    async ({ formData }) => {
      const file = formData.get("file") as File;
      const data = await file?.arrayBuffer();
      const workbook = XLSX.read(data);
      const mappings = selectMappings({
        workbook,
        targetColumns,
        keyIds,
        mappings: mappingsDefault,
      });
      const countOfMappedIds = keyIds.reduce((acc, keyId) => {
        if (mappings.mappings.find((mapping) => mapping.targetId === keyId)) {
          return ++acc;
        }
        return acc;
      }, 0);

      if (
        saveTargetTable &&
        !options?.previewTargetTable &&
        countOfMappedIds === keyIds.length
      ) {
        saveTargetTable({
          rows: selectTargetRows({ workbook, mappings }),
          workbookFileName: file.name,
        });
      } else {
        dispatch({
          type: "loadWorkbook",
          payload: { workbook, fileName: file.name },
        });
      }
    },
    [
      mappingsDefault,
      options?.previewTargetTable,
      saveTargetTable,
      targetColumns,
      keyIds,
    ]
  );

  const handleSaveKeyColumns = useCallback<KeyColumnsProps["save"]>(
    ({ mappings }) => {
      dispatch({ type: "setKeyColumns", payload: { mappings } });
    },
    []
  );

  const handleSaveMappings = useCallback<NonNullable<MapperProps["save"]>>(
    ({ mappings }) => {
      if (save) {
        save({
          mappings: selectMappings({
            workbook,
            targetColumns,
            keyIds,
            mappings: mappingsDefault,
            mappingsDraft: { keyIds, mappings },
          }),
        });
      }
      dispatch({ type: "setMappings", payload: { mappings } });
    },
    [mappingsDefault, save, targetColumns, keyIds, workbook]
  );

  const mappings = selectMappings({
    workbook,
    targetColumns,
    keyIds,
    mappings: mappingsDefault,
    mappingsDraft,
  });

  if (workbook && workbookFileName) {
    switch (step) {
      case "keyColumns":
        return (
          <KeyColumns
            {...{
              source: selectSource(workbook),
              keyIds,
              mappings: mappings.mappings,
              save: handleSaveKeyColumns,
            }}
          />
        );
      case "map":
        return (
          <>
            <WorkbookTeaser {...{ workbook, fileName: workbookFileName }} />
            <Divider />
            <Mapper
              {...{
                title: t("map_table_title", { name: workbookFileName }),
                source: selectSource(workbook),
                sourceFileName: workbookFileName,
                targetColumns,
                keyIds,
                mappings: mappings.mappings,
                save: handleSaveMappings,
                options: options?.mapper ?? {},
              }}
            />
          </>
        );
      case "preview":
        return (
          <>
            <TargetTable {...{ workbook, mappings }} />
            <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
            {saveTargetTable && (
              <ActionButton
                onClick={() =>
                  saveTargetTable({
                    rows: selectTargetRows({ workbook, mappings }),
                    workbookFileName,
                  })
                }
              >
                {t("save_target_table")}
              </ActionButton>
            )}
          </>
        );
      default:
        return null;
    }
  } else {
    return <FileUpload {...{ handleFile }} />;
  }
}

/*
Parse Excel file
https://www.npmjs.com/package/xlsx

DSL for string transformation 
Parser: https://github.com/Chevrotain/chevrotain
*/
