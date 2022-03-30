import JsonSchemaForm from "./";
import type { JSONSchema7 } from "json-schema";
import { Box } from "@mui/material";
import { UiSchema } from "@rjsf/core";
import { MultiSelectField, RadioField } from "./fields";
import { FieldTemplate } from "./FieldTemplate";

export default {
  title: "JSON Schema Form/Full Form",
};

const schema: JSONSchema7 = {
  title: "Test form",
  type: "object",
  properties: {
    foo: {
      type: "object",
      title: "Custom MultiSelect",
      properties: {
        predefined: {
          type: "array",
          items: {
            type: "string",
          },
        },
        custom: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
    bar: {
      title: "Custom Radio",
      type: "string",
      enum: ["yes", "no", "unknown"],
    },
  },
};

const uiSchema: UiSchema = {
  foo: {
    "ui:field": "CustomMultiSelect",
  },
  bar: {
    "ui:field": "CustomRadio",
  },
};

// see https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-widgets-fields/
// const widgets: { [k: string]: Widget } = {
//   CustomMultiSelect: MultiSelectWidget,
//   CustomRadio: RadioWidget,
// };

// const uiSchema2: UiSchema = {
//   "ui:options": {
//     inline: true,
//   },
// };

// see https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-widgets-fields/
// const fields1: { [k: string]: Field } = {};

export const Default = () => (
  <Box sx={{ width: 600, padding: 2 }}>
    <JsonSchemaForm
      {...{
        schema,
        uiSchema,
        // widgets,
<<<<<<< HEAD
        // fields: {
        //   CustomMultiSelect: MultiSelectWidget,
        //   CustomRadio: RadioWidget,
        // },
        // FieldTemplate: CustomFieldTemplate,
=======
        fields: {
          CustomMultiSelect: MultiSelectField,
          CustomRadio: RadioField,
        },
        FieldTemplate,
>>>>>>> 1090a2f (refactor: rename widgets & extract field template)
      }}
    ></JsonSchemaForm>
  </Box>
);
