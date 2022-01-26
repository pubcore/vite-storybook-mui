import { IdColumns, IdColumnsProps } from "./IdColumns";
import { selectSource } from "./source";
import { workbook2 } from "../../../test/testWorkbook";

const mappings: Args["mappings"] = [];

export default {
  title: "ExcelMapper/IdColumns",
  argTypes: {
    save: { action: "save" },
  },
  args: {
    mappings,
    targetIds: ["ORDER_ID", "PRODUCT_ID"],
    source: selectSource(workbook2),
  } as Args,
};
type Args = IdColumnsProps;

export const Default = (args: Args) => <IdColumns {...{ ...args }} />,
  LoadedMapping = (args: Args) => (
    <IdColumns
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
