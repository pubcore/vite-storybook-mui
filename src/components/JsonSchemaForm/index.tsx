import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import type { FormProps } from "@rjsf/core";
import { MultiSelectField } from "./fields";
import { ArrayFieldTemplate } from "./ArrayFieldTemplate";
import { ObjectFieldTemplate } from "./ObjectFieldTemplate";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { FieldTemplate } from "./FieldTemplate";
import { TemplatesType } from "@rjsf/utils";

const defaultFields: FormProps<unknown>["fields"] = {
  CustomMultiSelect: MultiSelectField,
};

const templates: Partial<TemplatesType> = {
  FieldTemplate,
  ArrayFieldTemplate,
  ObjectFieldTemplate,
};

export type JsonSchemaFormProps<T = any> = Omit<FormProps<T>, "validator"> & {
  validator?: FormProps<T>["validator"];
};

export function JsonSchemaForm<T = any>(props: JsonSchemaFormProps<T>) {
  const { t } = useTranslation();
  const transformErrors = useCallback<
    NonNullable<FormProps["transformErrors"]>
  >(
    (errors) => {
      return errors.map((e) => ({
        ...e,
        message: t(`form_error_${e.name}` as "_"),
      }));
    },
    [t]
  );

  const { fields: propsFields, ...rest } = props;

  const fields = useMemo(
    () => ({ ...defaultFields, ...propsFields }),
    [propsFields]
  );

  return (
    <Form
      {...{
        idPrefix: "rjsf",
        transformErrors,
        templates,
        showErrorList: false,
        fields,
        validator,
        ...rest,
      }}
    />
  );
}
