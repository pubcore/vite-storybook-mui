import { MuiForm5 as Form } from "@rjsf/material-ui";
import type { AjvError, FormProps } from "@rjsf/core";
import { FieldTemplate } from "./FieldTemplate";
import {
  MultiSelectField,
  RadioField,
  FooterField,
  UploadField,
} from "./fields";
import { t } from "i18next";

const fieldMapping: FormProps<unknown>["fields"] = {
  CustomMultiSelect: MultiSelectField,
  CustomRadio: RadioField,
  CustomFooter: FooterField,
  CustomUpload: UploadField,
};

function transformErrors(errors: AjvError[]): AjvError[] {
  return errors.map((e) => ({ ...e, message: t(`form_error_${e.name}`) }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function JsonSchemaForm<T = any>(props: FormProps<T>) {
  return (
    <Form
      {...{
        idPrefix: "rjsf",
        FieldTemplate,
        fields: fieldMapping,
        showErrorList: false,
        transformErrors,
        ...props,
      }}
    >
      {/* <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <ActionButton type="submit" variant="contained" size="large">
            {t("next_step")}
          </ActionButton>
        </Box> */}
    </Form>
  );
}
