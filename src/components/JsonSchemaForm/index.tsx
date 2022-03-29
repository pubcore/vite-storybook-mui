import { MuiForm5 as Form } from "@rjsf/material-ui";
import type { FormProps } from "@rjsf/core";
import { Theme, ThemeProvider, useTheme } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JsonSchemaForm<T = any>(props: FormProps<T>) {
  const theme: Theme = {
    ...useTheme(),
    components: {
      // MuiFormControl: {
      //   styleOverrides: {
      //     root: {
      //       flexDirection: "row",
      //     },
      //   },
      // },
      MuiFormLabel: {
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
          ...props,
          idPrefix: "rjsf",
          onSubmit: (e) => console.log("Submit", e.formData),
        }}
      ></Form>
    </ThemeProvider>
  );
}
