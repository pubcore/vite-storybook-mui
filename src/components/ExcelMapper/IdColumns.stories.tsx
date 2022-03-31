import { KeyColumns, KeyColumnsProps } from "./KeyColumns";
import { selectSource } from "./source";
import { workbook2 } from "../../../test/testWorkbook";

const mappings: Args["mappings"] = [];

export default {
  title: "ExcelMapper/KeyColumns",
  argTypes: {
    save: { action: "save" },
  },
  args: {
    mappings,
    keyIds: ["ORDER_ID", "PRODUCT_ID"],
    source: selectSource(workbook2),
  } as Args,
};
type Args = KeyColumnsProps;

export const Default = (args: Args) => <KeyColumns {...{ ...args }} />,
  LoadedMapping = (args: Args) => (
    <KeyColumns
      {...{
        ...args,
        mappings: [
          {
            sourceColumns: [{ name: "ORDER ID⏎OID" }],
            pipe: "",
            targetId: "ORDER_ID",
          },
          {
            sourceColumns: [{ name: "Product ID⏎PID" }],
            pipe: "",
            targetId: "PRODUCT_ID",
          },
        ],
      }}
    />
  );
