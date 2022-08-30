import { Field, FieldProps, ObjectFieldTemplateProps, utils } from "@rjsf/core";
import {
  FunctionComponent,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";
import { ObjectFieldTemplate } from "../ObjectFieldTemplate";
import { noop } from "lodash-es";

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
    formContext,
    formData,
    id,
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
  const help = uiSchema["ui:help"];
  const hidden = uiSchema["ui:widget"] === "hidden";

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

  const displayLabel = utils.getDisplayLabel(
    schema,
    uiSchema,
    registry.rootSchema
  );

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
  const classNames = classes.join(" ").trim();

  const CustomMultiSelect = registry.fields.CustomMultiSelect!;
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
  // TODO: evidence

  const templateProps: ObjectFieldTemplateProps = {
    ...props,
    title: props.title ?? "",
    description,
    DescriptionField,
    TitleField,
    onAddClick: () => () => void 0,
    // rawDescription: description,
    // help: <Help id={id + "__help"} help={help} />,
    // rawHelp: typeof help === "string" ? help : "",
    // errors: hideError || !errors ? <></> : <ErrorList errors={errors} />,
    // rawErrors: hideError ? [] : errors,
    // id: String(id),
    // label,
    // hidden,
    disabled,
    // fields: registry.fields,
    // onKeyChange: props.onKeyChange ?? (() => {}),
    // onDropPropertyClick: props.onDropPropertyClick ?? (() => {}),
    readonly,
    // hideError,
    // displayLabel,
    // classNames,
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

function Help(props: { id?: string; help: ReactNode | null }) {
  const { id, help } = props;
  if (!help) {
    return null;
  }
  if (typeof help === "string") {
    return (
      <p id={id} className="help-block">
        {help}
      </p>
    );
  }
  return (
    <div id={id} className="help-block">
      {help}
    </div>
  );
}

// function ErrorList(props: { errors: { error: ReactNode }[] }) {
//   const { errors = [] } = props;
//   if (errors.length === 0) {
//     return null;
//   }

//   return (
//     <div>
//       <ul className="error-detail bs-callout bs-callout-info">
//         {errors
//           .filter((elem) => !!elem)
//           .map((error, index) => {
//             return (
//               <li className="text-danger" key={index}>
//                 {error}
//               </li>
//             );
//           })}
//       </ul>
//     </div>
//   );
// }
