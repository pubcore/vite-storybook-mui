import { ArrayFieldTemplateProps, IdSchema, utils } from "@rjsf/core";
import { Box, Grid, Paper } from "@mui/material";

const { isMultiSelect, getDefaultRegistry } = utils;

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { schema, registry = getDefaultRegistry() } = props;

  if (isMultiSelect(schema, registry.rootSchema)) {
    return <DefaultFixedArrayFieldTemplate {...props} />;
  } else {
    return <DefaultNormalArrayFieldTemplate {...props} />;
  }
};

type ArrayFieldTitleProps = {
  TitleField: any;
  idSchema: IdSchema;
  title: string;
  required: boolean;
};

const ArrayFieldTitle = ({
  TitleField,
  idSchema,
  title,
  required,
}: ArrayFieldTitleProps) => {
  if (!title) {
    return null;
  }
  const id = `${idSchema.$id}__title`;

  return (
    <Box
      sx={{ paddingLeft: [...idSchema.$id.matchAll(/_/g)].length > 1 ? 1 : 0 }}
    >
      <TitleField id={id} title={title} required={required} />
    </Box>
  );
};

type ArrayFieldDescriptionProps = {
  DescriptionField: any;
  idSchema: IdSchema;
  description: string;
};

const ArrayFieldDescription = ({
  DescriptionField,
  idSchema,
  description,
}: ArrayFieldDescriptionProps) => {
  if (!description) {
    return null;
  }

  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
};

// Used in the two templates
const DefaultArrayItem = (props: any) => {
  return (
    <Grid item p={1} key={props.key} xs={12}>
      {props.children}
    </Grid>
  );
};

const DefaultFixedArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { idSchema, uiSchema, schema } = props;
  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={idSchema}
        title={props.uiSchema["ui:title"] || props.title}
        required={props.required}
      />
      {(props.uiSchema["ui:description"] || schema.description) && (
        <div
          className="field-description"
          key={`field-description-${idSchema.$id}`}
        >
          {uiSchema["ui:description"] || schema.description}
        </div>
      )}
      <div
        className="row array-item-list"
        key={`array-item-list-${idSchema.$id}`}
      >
        {props.items && props.items.map(DefaultArrayItem)}
      </div>
    </fieldset>
  );
};

const DefaultNormalArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { TitleField, idSchema, uiSchema, required, schema } = props;
  const title = schema.title || uiSchema["ui:title"];
  const description = uiSchema["ui:description"] || schema.description;

  return (
    <>
      {title && (
        <ArrayFieldTitle
          key={`array-field-title-${idSchema.$id}`}
          {...{ required, idSchema, TitleField, title }}
        />
      )}

      {description && (
        <ArrayFieldDescription
          key={`array-field-description-${idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          {...{ idSchema, description }}
        />
      )}

      <Grid container key={`array-item-list-${idSchema.$id}`}>
        {props.items && props.items.map((p) => DefaultArrayItem(p))}
      </Grid>
    </>
  );
};

export { ArrayFieldTemplate };
