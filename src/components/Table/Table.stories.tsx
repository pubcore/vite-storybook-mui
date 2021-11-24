import { ObjectTable } from "../";

export default {
  title: "Table",
  argTypes: {
    onChange: { action: "onChange" },
  },
  args: {
    rows: [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ],
    columns: ["Name", "Company", "City", "State"],
    count: 24,
    page: 3,
  },
};

const testObject = {
  name: "Bond",
  licence: "007",
  kills: 999,
  firstname: "James",
  nested: {
    foo: "one",
    too: null,
  },
  adress: {
    zip: 72108,
    city: "Rottenburg",
  },
};

export const ObjectTbl = () => (
  <ObjectTable
    {...{
      o: testObject,
      attributes: ["firstname", "name", "nested.foo", "adress"],
    }}
  />
);
