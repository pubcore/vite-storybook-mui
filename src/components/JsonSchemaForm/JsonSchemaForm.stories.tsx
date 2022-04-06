import { JsonSchemaForm } from "./";
import type { JSONSchema7 } from "json-schema";
import { Box } from "@mui/material";
import { UiSchema } from "@rjsf/core";

export default {
  title: "JSON Schema Form/Full Form",
};

const schema: JSONSchema7 = {
  title: "Test form",
  type: "object",
  properties: {
    group: {
      type: "object",
      title: "Group Name",
      required: ["foo", "bar"],
      properties: {
        foo: {
          type: "object",
          title: "Custom MultiSelect",
          properties: {
            predefined: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "ISO-XY01",
                  "ISO-XY02",
                  "ISO-XY03",
                  "ISO-XY04",
                  "ISO-XY05",
                  "ISO-ABCDEFGHIJKLMNOPQRSTUVWXYZ-01",
                  "ISO-ABCDEFGHIJKLMNOPQRSTUVWXYZ-02",
                ],
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
    },
  },
};

const uiSchema: UiSchema = {
  group: {
    foo: {
      "ui:field": "CustomMultiSelect",
      "ui:options": {
        helpUri: "http://africau.edu/images/default/sample.pdf",
      },
    },
    bar: {
      "ui:field": "CustomRadio",
    },
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
        onSubmit: ({ formData }) => console.info("Form submitted:", formData),
        schema,
        uiSchema,
      }}
    />
  </Box>
);
