import JsonSchemaForm from "./";
import type { JSONSchema7 } from "json-schema";
import { Box, Typography } from "@mui/material";
import { FieldTemplateProps, UiSchema, Widget } from "@rjsf/core";
import { MultiSelectWidget, RadioWidget } from "./widgets";

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

// see https://react-jsonschema-form.readthedocs.io/en/v1.8.1/advanced-customization/#field-template
function CustomFieldTemplate(props: FieldTemplateProps) {
  const { id, label, description, children, errors, help } = props;

  console.log("DBG props", props);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {label && id !== "rjsf" ? <Typography>{label}</Typography> : null}
      <Box>
        {description}
        {children}
        {errors}
        {help}
      </Box>
    </Box>
  );
}

export const Default = () => (
  <Box sx={{ width: 500, padding: 2 }}>
    <JsonSchemaForm
      {...{
        schema,
        uiSchema,
        // widgets,
        // fields: {
        //   CustomMultiSelect: MultiSelectWidget,
        //   CustomRadio: RadioWidget,
        // },
        // FieldTemplate: CustomFieldTemplate,
      }}
    ></JsonSchemaForm>
  </Box>
);
