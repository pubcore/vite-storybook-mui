import { ExcelMapper, stringMaps } from "../";
import mappings from "../../../test/testMapping.json";
import {
  fileName2,
  fileName3,
  fileName5,
  workbook,
  workbook2,
  workbook3,
  workbook5,
} from "../../../test/testWorkbook";
import { ExcelMapperProps } from ".";
import { action } from "@storybook/addon-actions";
import { Button, Portal } from "@mui/material";
import { ExcelMapperStepProps } from "./MappingRunner";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export default {
  title: "ExcelMapper/ExcelMapper",
  argTypes: {
    save: { action: "save" },
    cancel: { action: "cancel" },
  },
  args: { mappings },
};

type Args = ExcelMapperProps;

const saveTargetTable = action("saveTargetTable", {});

export const Default = (args: Args) => (
    <ExcelMapper {...{ ...args, mappings: { ...mappings, mappings: [] } }} />
  ),
  CreateMappingBySearchOfTargetCols = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        workbook: workbook2,
        mappings: { ...mappings, mappings: [] },
      }}
    />
  ),
  LoadedMappingJson = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        workbook,
      }}
    />
  ),
  RunMappingIfSaveTargetHanlder = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        saveTargetTable,
      }}
    />
  ),
  RunMappingSkipUploadIfWorkbook = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        saveTargetTable,
        workbook: workbook2,
        workbookFileName: fileName2,
      }}
    />
  ),
  RunMappingAutoMapIdColumns = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        saveTargetTable,
        workbook: workbook2,
        workbookFileName: fileName2,
        mappings: { ...mappings, mappings: [] },
      }}
    />
  ),
  RunWithMappingErrors = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        saveTargetTable,
        workbook: workbook3,
        workbookFileName: fileName3,
        mappings: { ...mappings, mappings: [] },
      }}
    />
  ),
  //only the first keyId is required for all pages, secondary keyIds must not exist
  RunWithOptionalKeyColumns = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        saveTargetTable,
        workbook: workbook5,
        workbookFileName: fileName5,
        mappings: { ...mappings, mappings: [] },
      }}
    />
  ),
  RunWithSystemMappings = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        saveTargetTable,
        workbook: workbook5,
        workbookFileName: fileName5,
        mappings: { ...mappings, mappings: [] },
        systemMappings: {
          S: [
            (s: string) => stringMaps.delimiters(s, { to: "|" })!,
            (s: string) =>
              s
                .split("|")
                .map((v) => v.trim())
                .join("|"),
          ],
        },
      }}
    />
  ),
  RunWithAdditionalWorkflowStep = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        workbook: workbook2,
        workbookFileName: fileName2,
        saveTargetTable: async function () {
          //processing of save ...
          //...
          //we assume, save failed, user must do something in step 3:
          return 2;
        },
        options: {
          runner: {
            additionalSteps: {
              steps: ["ADDITIONAL STEP"],
              renderStep: (props) => <AdditionlRunnerStep {...props} />,
            },
          },
        },
      }}
    />
  );

function AdditionlRunnerStep({
  buttonsContainerRef,
  next,
  cancel,
  step,
}: ExcelMapperStepProps) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Box display="flex" justifyContent="space-around">
        This is an additional step ({step}) example dummy
      </Box>

      <Portal container={buttonsContainerRef.current}>
        <Button
          variant="outlined"
          onClick={() => {
            cancel();
          }}
        >
          cancel
        </Button>
        &nbsp;
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await new Promise<void>((res) => {
              setTimeout(() => {
                setLoading(false);
                res();
              }, 1000);
            });
            next();
          }}
        >
          additional step save
        </LoadingButton>
      </Portal>
    </>
  );
}
