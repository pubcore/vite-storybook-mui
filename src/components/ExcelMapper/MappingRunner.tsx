import { useCallback, useState } from "react";
import {
  FileUpload,
  FileUploadProps,
  acceptExcel,
  Status,
  Workflow,
} from "../";
import { WorkBook, read } from "xlsx";
import WorkbookTeaser from "./WorkbookTeaser";
import { MappingsJson } from "./MappingsJson";
import { useTranslation } from "react-i18next";
import { TargetRow } from "./maps/selectTargetRows";
import { selectTargetRows } from "./target/selectTargetRows";
import { ActionButton } from "../Button";
import { selectStateMappingsOfMappingsJson } from "./maps/selectStateMappingsOfMappingsJson";
import { Divider, Toolbar } from "@mui/material";
import { selectSeverities, SystemMap } from "./maps";
import { Findings } from "./Findings";
import { selectMappings } from "./maps/selectMappings";
import ObjectTable from "../Table/ObjectTable";

export interface MappingRunnerProps {
  mappings: MappingsJson;
  systemMappings?: Record<string, SystemMap[]>;
  saveTargetTable: ({
    rows,
    workbookFileName,
    workbook,
  }: {
    rows: TargetRow[];
    workbookFileName: string;
    workbook: WorkBook;
  }) => void;
  workbook?: WorkBook;
  workbookFileName?: string;
  cancel?: () => void;
}

type SelectedWorkbook =
  | {
      workbook: WorkBook;
      fileName: string;
    }
  | Record<string, never>;

export function MappingRunner(props: MappingRunnerProps) {
  const {
    mappings: mappingsJson,
    saveTargetTable,
    workbook: workbookDefault,
    workbookFileName,
    cancel,
    systemMappings,
  } = props;
  const { t } = useTranslation();
  const steps = [t("select_file"), t("review_mapping_result"), t("save")];
  const { targetColumns } = mappingsJson;
  const [{ workbook, fileName }, setWorkbook] = useState<SelectedWorkbook>(
    workbookDefault && workbookFileName
      ? {
          workbook: workbookDefault,
          fileName: workbookFileName,
        }
      : {}
  );

  const mappings = workbook
    ? selectMappings({ workbook, mappings: mappingsJson })
    : mappingsJson;

  const [activeStep, setActiveStep] = useState<number>(
    workbookDefault && workbookFileName ? 1 : 0
  );

  if (!workbook && activeStep != 0) {
    setActiveStep(0);
  }

  const handleFile: FileUploadProps["handleFile"] = useCallback(
    async ({ formData }) => {
      const file = formData.get("file") as File;
      const data = await file?.arrayBuffer();
      const workbook = read(data);
      setWorkbook({ workbook, fileName: file.name });
      setActiveStep(1);
    },
    []
  );

  function handleSave() {
    saveTargetTable({ rows, workbookFileName: fileName, workbook });
  }

  const [, findings] = workbook
    ? selectStateMappingsOfMappingsJson(
        {
          workbook,
          targetColumns,
          keyIds: mappings.keyIds,
        },
        mappings.mappings
      )
    : [];

  const { errors } = selectSeverities({ findings });
  const rows =
    workbook && !errors
      ? selectTargetRows({
          workbook,
          mappings: { ...mappingsJson, mappings: mappings.mappings },
          systemMappings,
        })
      : [];

  const step = (() => {
    switch (activeStep) {
      case 0:
        return (
          <FileUpload
            {...{
              handleFile,
              accept: acceptExcel,
            }}
          />
        );
      case 1: {
        return (
          <>
            <WorkbookTeaser {...{ workbook, fileName }} />
            <Divider sx={{ my: 1 }} />
            {errors ? (
              <>
                <Status
                  text={String(t("mapping_errors_found"))}
                  severity="error"
                />
                <Findings {...{ findings }} />
              </>
            ) : (
              <>
                <Status text={String(t("mapping_ok"))} severity="info" />
                <ObjectTable
                  {...{
                    o: {
                      totalCountOfTargetColumns: targetColumns.length,
                      totalCountOfMappedColumns: Object.keys(rows[0] ?? {})
                        .length,
                      totalCountOfRows: rows.length,
                    },
                    attributes: [
                      "totalCountOfTargetColumns",
                      "totalCountOfMappedColumns",
                      "totalCountOfRows",
                    ],
                    name: "mapping",
                  }}
                />
              </>
            )}
          </>
        );
      }
      default:
        return null;
    }
  })();
  const actions = (() => {
    switch (activeStep) {
      case 0:
        return (
          <Toolbar
            variant="dense"
            sx={{ justifyContent: "space-between", alignItems: "end" }}
          >
            &nbsp;
            {cancel && (
              <ActionButton variant="outlined" onClick={() => cancel()}>
                {t("cancel")}
              </ActionButton>
            )}
          </Toolbar>
        );
      case 1:
        return (
          <>
            <Toolbar
              variant="dense"
              sx={{ justifyContent: "space-between", alignItems: "end" }}
            >
              <ActionButton
                variant="outlined"
                onClick={() => {
                  setWorkbook({});
                }}
              >
                {t("back")}
              </ActionButton>
              <div>
                {cancel && (
                  <ActionButton variant="outlined" onClick={() => cancel()}>
                    {t("cancel")}
                  </ActionButton>
                )}
                &nbsp;
                <ActionButton disabled={Boolean(errors)} onClick={handleSave}>
                  {t("save")}
                </ActionButton>
              </div>
            </Toolbar>
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <Workflow {...{ steps, activeStep }}>
      {step}
      {actions}
    </Workflow>
  );
}
