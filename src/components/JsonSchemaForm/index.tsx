import { MuiForm5 as Form } from "@rjsf/material-ui";
import type { FormProps } from "@rjsf/core";
import { Theme, ThemeProvider, useTheme } from "@mui/material";
import { FieldTemplate } from "./FieldTemplate";
import { MultiSelectField, RadioField } from "./fields";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function JsonSchemaForm<T = any>(props: FormProps<T>) {
  const theme: Theme = {
    ...useTheme(),
    components: {
      MuiFormLabel: {
        // replaced with custom labels in FieldTemplate.tsx
        styleOverrides: {
          root: {
            display: "none",
          },
        },
      },
    },
  };

  return (
    <ThemeProvider {...{ theme }}>
      <Form
        {...{
          idPrefix: "rjsf",
          FieldTemplate,
          fields: {
            CustomMultiSelect: MultiSelectField,
            CustomRadio: RadioField,
          },
          ...props,
        }}
      ></Form>
    </ThemeProvider>
  );
}
