import Map, { MapperProps } from ".";
import { selectSource } from "../source";
import { fileName4, workbook4 } from "../../../../test/testWorkbook";
type Args = MapperProps;
import { t } from "i18next";
import mappingJson, { targetColumns } from "../../../../test/testMapping.json";

export default {
  title: "ExcelMapper/Map",
  args: {
    title: t("map_table_title", {
      name: fileName4,
    }),
    targetColumns,
    source: selectSource(workbook4),
    keyIds: mappingJson.keyIds,
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
