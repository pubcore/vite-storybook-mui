import { useCallback, useState } from "react";
import { ActionButton, FileUpload, FileUploadProps } from "../";
import XLSX, { WorkBook } from "xlsx";
import WorkbookTeaser from "./WorkbookTeaser";
import { Divider } from "@mui/material";
import Map, { MapperProps } from "./Mapper";
import { selectSource } from "./source";
import { IdColumns, IdColumnsProps } from "./IdColumns";
import { MappingsJson } from "./MappingsJson";
import { useTranslation } from "react-i18next";
import update from "immutability-helper";
import { TargetTable } from "./TargetTable";
import { TargetRow } from "./maps/selectTargetRows";
import { selectTargetRows } from "./target/selectTargetRows";

interface State {
  workbook?: WorkBook;
  workbookFileName?: string;
}

export interface ExcelMapperProps {
  targetColumns: MapperProps["targetColumns"];
  targetIds: string[];
  mappings?: MappingsJson;
  workbook?: WorkBook;
  save?: ({ mappings }: { mappings: MappingsJson }) => void;
  saveTargetTable?: ({ rows }: { rows: TargetRow[] }) => void;
}

export default function ExcelMapper({
  targetColumns,
  targetIds,
  mappings: mappingsDefault,
  workbook: workbookDefault,
  save,
  saveTargetTable,
}: ExcelMapperProps) {
  const { t } = useTranslation();
  const [{ workbook, workbookFileName }, setWorkbook] = useState<State>({
    ...(workbookDefault
      ? { workbook: workbookDefault, workbookFileName: "-" }
      : {}),
  });

  const [mappings, setMappings] = useState<MappingsJson>(
    mappingsDefault ?? { targetIds, mappings: [] }
  );

  const handleFile: FileUploadProps["handleFile"] = useCallback(
    async ({ formData }) => {
      const file = formData.get("file") as File;
      const data = await file?.arrayBuffer();
      const workbook = XLSX.read(data);
      setWorkbook(({ ...rest }) => ({
        ...rest,
        workbook,
        workbookFileName: file.name,
      }));
    },
    []
  );

  const countOfMappedIds = targetIds.reduce((acc, targetId) => {
    if (mappings.mappings.find((mapping) => mapping.targetId === targetId)) {
      return ++acc;
    }
    return acc;
  }, 0);

  const [step, setStep] = useState<string>(
    countOfMappedIds === targetIds.length ? "map" : "idColumns"
  );

  const handleSaveIdColumns = useCallback<IdColumnsProps["save"]>(
    ({ mappings: newMappings }) => {
      for (const targetId of targetIds) {
        const mappingIndex = mappings.mappings.findIndex(
          (mapping) => mapping.targetId === targetId
        );
        const newMappingIndex = newMappings.findIndex(
          (mapping) => mapping.targetId === targetId
        );

        if (newMappingIndex >= 0 && mappingIndex < 0) {
          setMappings((s) =>
            update(s, {
              mappings: { $unshift: [newMappings[newMappingIndex]] },
            })
          );
        } else if (newMappingIndex >= 0 && mappingIndex >= 0) {
          setMappings((s) =>
            update(s, {
              mappings: {
                [mappingIndex]: { $set: newMappings[newMappingIndex] },
              },
            })
          );
        } else if (newMappingIndex < 0 && mappingIndex >= 0) {
          setMappings((s) =>
            update(s, {
              mappings: { $splice: [[mappingIndex, 1]] },
            })
          );
        }
      }
      setStep("map");
    },
    [mappings, targetIds]
  );

  const handleSaveMappings = useCallback<NonNullable<MapperProps["save"]>>(
    ({ mappings }) => {
      setMappings((s) => update(s, { mappings: { $set: mappings } }));
      setStep("preview");
    },
    []
  );

  if (workbookFileName && workbook) {
    if (saveTargetTable && mappingsDefault && step == "map") {
      //TODO selectTargetRows could be expensive => async
      saveTargetTable({
        rows: selectTargetRows({ workbook, mappings: mappingsDefault }),
      });
      setWorkbook({});
    }

    switch (step) {
      case "idColumns":
        return (
          <IdColumns
            {...{
              source: selectSource(workbook),
              targetIds,
              mappings: mappings.mappings,
              save: handleSaveIdColumns,
            }}
          />
        );
      case "map":
        return (
          <>
            <WorkbookTeaser {...{ workbook, fileName: workbookFileName }} />
            <Divider />
            <Map
              {...{
                title: t("map_table_title", { name: workbookFileName }),
                source: selectSource(workbook),
                sourceFileName: workbookFileName,
                targetColumns,
                targetIds,
                mappings: mappings.mappings,
                save: handleSaveMappings,
              }}
            />
          </>
        );
      case "preview":
        return (
          <>
            <TargetTable {...{ workbook, mappings }} />
            <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
            {save && (
              <ActionButton onClick={() => save({ mappings })}>
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
