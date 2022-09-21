import { Field, FieldProps, ObjectFieldTemplateProps, utils } from "@rjsf/core";
import { FunctionComponent, JSXElementConstructor, ReactElement } from "react";
import { noop } from "lodash-es";
import { ObjectFieldTemplate } from "../ObjectFieldTemplate";

type Claim = {
  [key: string]:
    | string
    | Record<"predefined" | "custom", string[]>
    | Record<"uri", string>[]
    | undefined;
  name: string;
  answer?: "yes" | "no" | "unknown";
  items?: {
    predefined: Array<string>;
    custom: Array<string>;
  };
  evidence?: {
    uri: string;
  }[];
};

export function HigherOrderField(props: FieldProps<Claim>) {
  const {
    name,
    schema,
    uiSchema,
    formData,
    errorSchema,
    registry,
    wasPropertyKeyModified,
    onChange: outerOnChange,
  } = props;

  const onChange = (propName: string, val: unknown) => {
    const newClaim = { ...formData, [propName]: val } as Claim;
    outerOnChange(newClaim, errorSchema);
  };

  const description =
    uiSchema["ui:description"] ||
    props.schema.description ||
    schema.description;
  const errors = errorSchema.__errors;

  const uiSchemaHideError = uiSchema["ui:hideError"];
  // Set hideError to the value provided in the uiSchema, otherwise stick with the prop to propagate to children
  const hideError =
    uiSchemaHideError === undefined
      ? props.hideError
      : Boolean(uiSchemaHideError);

  let label;
  if (wasPropertyKeyModified) {
    label = name;
  } else {
    label = uiSchema["ui:title"] || props.schema.title || schema.title || name;
  }

  const disabled = Boolean(props.disabled || uiSchema["ui:disabled"]);

  const readonly = Boolean(
    props.readonly ||
      uiSchema["ui:readonly"] ||
      props?.schema?.readOnly ||
      schema.readOnly
  );

  let classes = ["form-group", "field", `field-${schema.type}`];
  if (!hideError && Array.isArray(errors) && errors.length > 0) {
    classes.push("field-error has-error has-danger");
  }
  classes.push(uiSchema.classNames);

  const SchemaField = registry.fields.SchemaField! as unknown as Field;
  const DescriptionField = registry.fields
    .DescriptionField! as unknown as FunctionComponent<{
    id: string;
    description:
      | string
      | ReactElement<any, string | JSXElementConstructor<any>>;
  }>;
  const TitleField = registry.fields
    .TitleField! as unknown as FunctionComponent<{
    id: string;
    title: string;
    required: boolean;
  }>;

  let propertyName,
    uiSchemaSnippet = {};

  if (schema.properties?.items) {
    propertyName = "items";
    uiSchemaSnippet = {
      "ui:field": "CustomMultiSelect",
    };
  } else {
    propertyName = "answer";
    uiSchemaSnippet = {
      "ui:widget": "radio",
      "ui:inline": true,
      "ui:label": false,
    };
  }

  const templateProps: ObjectFieldTemplateProps = {
    ...props,
    title: props.title ?? "",
    description,
    DescriptionField,
    TitleField,
    onAddClick: () => () => {},
    disabled,
    readonly,
    uiSchema,
    properties: [propertyName].map((name) => {
      const addedByAdditionalProperties = schema.properties?.[
        name
      ]?.hasOwnProperty(utils.ADDITIONAL_PROPERTY_FLAG);
      const fieldUiSchema = addedByAdditionalProperties
        ? uiSchema.additionalProperties
        : uiSchema[name];
      const hidden = fieldUiSchema && fieldUiSchema["ui:widget"] === "hidden";

      const schemaSnippet = schema.properties![name]!;
      const formDataSnippet = formData?.[name] ?? {};

      const schemaFieldProps = {
        ...props,
        name,
        required: props.required,
        schema: schemaSnippet,
        uiSchema: uiSchemaSnippet,
        errorSchema: errorSchema[name]!,
        idSchema: props.idSchema[name]!,
        formData: formDataSnippet,
        onKeyChange: noop,
        onChange: (val: string) => onChange(name, val),
        onBlur: noop,
        onFocus: noop,
        registry,
        disabled,
        readonly,
        hideError,
      };

      return {
        content: (
          <SchemaField
            key={name}
            {...(schemaFieldProps as unknown as FieldProps)}
          />
        ),
        name,
        readonly,
        disabled,
        required: props.required,
        hidden,
      };
    }),
  };

  return (
    <ObjectFieldTemplate {...(templateProps as ObjectFieldTemplateProps)} />
  );
}
