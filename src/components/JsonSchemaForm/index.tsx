import Form from "@rjsf/material-ui/v5";
import type { AjvError, FormProps } from "@rjsf/core";
import { MultiSelectField } from "./fields";
import { ArrayFieldTemplate } from "./ArrayFieldTemplate";
import { ObjectFieldTemplate } from "./ObjectFieldTemplate";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { FieldTemplate } from "./FieldTemplate";

const defaultFields: FormProps<unknown>["fields"] = {
  CustomMultiSelect: MultiSelectField,
};

export function JsonSchemaForm<T = any>(props: FormProps<T>) {
  const { t } = useTranslation();
  const transformErrors = useCallback(
    (errors: AjvError[]): AjvError[] => {
      return errors.map((e) => ({
        ...e,
        message: t(`form_error_${e.name}` as "_"),
      }));
    },
    [t]
  );

  const fields = useMemo(
    () => ({ ...defaultFields, ...props.fields }),
    [props.fields]
  );

  return (
    <Form
      {...{
        idPrefix: "rjsf",
        transformErrors,
        FieldTemplate,
        ObjectFieldTemplate,
        showErrorList: false,
        ArrayFieldTemplate,
        fields,
        ...props,
      }}
    />
  );
}
