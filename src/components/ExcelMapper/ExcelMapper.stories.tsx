import { ExcelMapper } from "../";
import {
  targetColumns,
  targetColumnsBasic,
  workbook2,
} from "../../../test/testWorkbook";
import mappingJson, { keyIds } from "../../../test/testMapping.json";
import { workbook2 as workbook } from "../../../test/testWorkbook";
import { ExcelMapperProps } from ".";
import { action } from "@storybook/addon-actions";

export default {
  title: "ExcelMapper/ExcelMapper",
  argTypes: {
    save: { action: "save" },
  },
  args: { targetColumns, keyIds } as Args,
};

type Args = ExcelMapperProps;

export const Default = (args: Args) => <ExcelMapper {...args} />,
  CreateMappingBySearchOfTargetCols = (args: Args) => (
    <ExcelMapper
      {...{ ...args, workbook, targetColumns: targetColumnsBasic }}
    />
  ),
  LoadedMappingJson = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        keyIds: mappingJson.keyIds,
        mappings: mappingJson,
        workbook: workbook2,
      }}
    />
  ),
  SaveAfterUploadIfSaveTargetHanlder = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        mappings: mappingJson,
        saveTargetTable: action("saveTargetTable"),
      }}
    />
  );
