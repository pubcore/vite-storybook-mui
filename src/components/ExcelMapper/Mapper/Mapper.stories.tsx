import Map, { MapperProps } from ".";
import { selectSource } from "../source";
import { fileName, workbook2 } from "../../../../test/testWorkbook";
import { targetColumns } from "../../../../test/testWorkbook";
type Args = MapperProps;
import { t } from "i18next";
import mappingJson from "../../../../test/testMapping.json";

export default {
  title: "ExcelMapper/Map",
  args: {
    title: t("map_table_title", {
      name: fileName,
    }),
    targetColumns,
    source: selectSource(workbook2),
    targetIds: mappingJson.targetIds,
  } as Args,
  argTypes: {
    save: {
      action: "saveMappings",
    },
  },
};

export const Default = (args: Args) => <Map {...{ ...args }} />,
  Initialized = (args: Args) => (
    <Map
      {...{
        ...args,
        mappings: mappingJson.mappings,
      }}
    />
  );
