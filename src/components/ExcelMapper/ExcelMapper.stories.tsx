import { ExcelMapper } from "../";
import { targetColumns } from "../../../test/testWorkbook";
import mappingJson from "../../../test/testMapping.json";
import { workbook2 as workbook } from "../../../test/testWorkbook";
import { ExcelMapperProps } from ".";
import { action } from "@storybook/addon-actions";

export default {
  title: "ExcelMapper/ExcelMapper",
  argTypes: {
    save: { action: "save" },
  },
  args: { targetColumns, targetIds: ["ORDER_ID", "PRODUCT_ID"] } as Args,
};

type Args = ExcelMapperProps;

export const Default = (args: Args) => <ExcelMapper {...args} />,
  LoadedMappingJson = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        targetIds: mappingJson.targetIds,
        mappings: mappingJson,
        workbook,
      }}
    />
  ),
  SaveAfterUploadIfMappingIsGiven = (args: Args) => (
    <ExcelMapper
      {...{
        ...args,
        mappings: mappingJson,
        saveTargetTable: action("saveTargetTable"),
      }}
    />
  );
