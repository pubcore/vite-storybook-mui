import { ExcelMapper } from "../";
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

export default {
  title: "ExcelMapper/ExcelMapper",
  argTypes: {
    save: { action: "save" },
    cancel: { action: "cancel" },
  },
  args: { mappings },
};

type Args = ExcelMapperProps;

const saveTargetTable = action("saveTargetTable");

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
  );
