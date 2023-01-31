import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { LoadingButton } from "@mui/lab";

export interface MappingRunnerProps {
  mappings: MappingsJson;
  systemMappings?: Record<string, SystemMap[]>;
  /**
   * If there are errors a user can solve, a workflow-step number can be
   * returned the runner should go to. If a falsy value is returned => no errors
   * Property "additionalSteps" has to be used to render corresponding step
   */
  saveTargetTable: ({
    rows,
    workbookFileName,
    workbook,
  }: {
    rows: TargetRow[];
    workbookFileName: string;
    workbook: WorkBook;
  }) => void | number | undefined | Promise<number | undefined | void>;
  additionalSteps?: {
    steps: string[];
    renderStep: (props: ExcelMapperStepProps) => ReactNode;
  };
  workbook?: WorkBook;
  workbookFileName?: string;
  cancel?: () => void;
}

export type ExcelMapperStepProps = {
  step: number;
  cancel: () => void | Promise<void>;
  next: () => void | Promise<void>;
  buttonsContainerRef: RefObject<HTMLDivElement>;
};

type SelectedWorkbook =
  | {
      workbook: WorkBook;
      fileName: string;
    }
  | Record<string, never>;

export function MappingRunner({
  mappings: mappingsJson,
  saveTargetTable,
  workbook: workbookDefault,
  workbookFileName,
  cancel,
  systemMappings,
  additionalSteps,
}: MappingRunnerProps) {
  const { t } = useTranslation();
  const steps = useMemo(
    () => [
      t("select_file"),
      t("review_mapping_result"),
      ...(additionalSteps?.steps ?? []),
      t("save"),
    ],
    [additionalSteps?.steps, t]
  );
  const { targetColumns } = mappingsJson;
  const [{ workbook, fileName }, setWorkbook] = useState<SelectedWorkbook>(
    workbookDefault && workbookFileName
      ? {
          workbook: workbookDefault,
          fileName: workbookFileName,
        }
      : {}
  );

  const mappings = useMemo(
    () =>
      workbook
        ? selectMappings({ workbook, mappings: mappingsJson })
        : mappingsJson,
    [mappingsJson, workbook]
  );

  const [activeStep, setActiveStep] = useState<number>(
    workbookDefault && workbookFileName ? 1 : 0
  );

  if (!workbook && activeStep != 0) {
    setActiveStep(0);
  }

  const handleFile = useCallback<NonNullable<FileUploadProps["handleFile"]>>(
    async ({ formData }) => {
      const file = formData.get("file") as File;
      const data = await file?.arrayBuffer();
      const workbook = read(data);
      setWorkbook({ workbook, fileName: file.name });
      setActiveStep(1);
    },
    []
  );

  const [, findings] = useMemo(
    () =>
      workbook
        ? selectStateMappingsOfMappingsJson(
            {
              workbook,
              targetColumns,
              keyIds: mappings.keyIds,
            },
            mappings.mappings
          )
        : [],
    [mappings.keyIds, mappings.mappings, targetColumns, workbook]
  );

  const { errors } = selectSeverities({ findings });
  const rows = useMemo(
    () =>
      workbook && !errors
        ? selectTargetRows({
            workbook,
            mappings: { ...mappingsJson, mappings: mappings.mappings },
            systemMappings,
          })
        : [],
    [errors, mappings.mappings, mappingsJson, systemMappings, workbook]
  );
  const [inProgress, setInProgress] = useState(false);

  const handleSave = useCallback(
    async (e: any, _rows?: typeof rows) => {
      try {
        setInProgress(true);
        const step = await saveTargetTable({
          rows: _rows ?? rows,
          workbookFileName: fileName,
          workbook,
        });
        if (!!step) {
          setActiveStep(step);
        }
      } finally {
        setInProgress(false);
      }
    },
    [fileName, rows, saveTargetTable, workbook]
  );

  const handleAdditionStepNext = useCallback(async () => {
    await handleSave(
      undefined,
      selectTargetRows({
        workbook,
        mappings: { ...mappingsJson, mappings: mappings.mappings },
        //force re-calculation of system maps
        systemMappings: { ...systemMappings },
      })
    );
  }, [handleSave, mappings.mappings, mappingsJson, systemMappings, workbook]);

  const handleCancel = useCallback(async () => {
    cancel && (await cancel());
  }, [cancel]);

  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const stepHeader = (
    <>
      <WorkbookTeaser {...{ workbook, fileName }} />
      <Divider sx={{ my: 1 }} />
    </>
  );
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
            {stepHeader}
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
        return additionalSteps?.renderStep ? (
          <>
            {stepHeader}
            {additionalSteps.renderStep({
              step: activeStep,
              cancel: handleCancel,
              buttonsContainerRef,
              next: handleAdditionStepNext,
            })}
          </>
        ) : null;
    }
  })();

  const actionButtons = (
    <>
      {cancel && (
        <ActionButton variant="outlined" onClick={() => cancel()}>
          {t("cancel")}
        </ActionButton>
      )}
      &nbsp;
      <LoadingButton
        loading={inProgress}
        disabled={Boolean(errors)}
        onClick={handleSave}
        variant="contained"
      >
        {t("save")}
      </LoadingButton>
    </>
  );

  const actions = (() => {
    switch (
      activeStep <= 0
        ? "first"
        : activeStep >= steps.length - 2 //2, because last step "save" is skiped
        ? "last"
        : "between"
    ) {
      case "first":
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
      case "between":
        return (
          <Toolbar
            variant="dense"
            sx={{ justifyContent: "space-between", alignItems: "end" }}
          >
            <ActionButton
              variant="outlined"
              onClick={() => {
                activeStep === 1
                  ? setWorkbook({})
                  : setActiveStep(activeStep - 1);
              }}
            >
              {t("back")}
            </ActionButton>
            <div ref={buttonsContainerRef}>
              {(steps.length <= 3 || [0, 1].includes(activeStep)) &&
                actionButtons}
            </div>
          </Toolbar>
        );
      case "last":
        return (
          <Toolbar
            variant="dense"
            sx={{ justifyContent: "space-between", alignItems: "end" }}
          >
            <ActionButton
              variant="outlined"
              onClick={() => {
                activeStep === 1
                  ? setWorkbook({})
                  : setActiveStep(activeStep - 1);
              }}
            >
              {t("back")}
            </ActionButton>
            <div ref={buttonsContainerRef}>
              {(steps.length <= 3 || [0, 1].includes(activeStep)) &&
                actionButtons}
            </div>
          </Toolbar>
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
