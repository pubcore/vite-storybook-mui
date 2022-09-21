import { FormSubmit, UiSchema } from "@rjsf/core";
import { JSONSchema7 } from "json-schema";
import { UploadField as UploadFieldComp } from ".";
import { JsonSchemaForm } from "../..";
import { FieldTemplate } from "../../FieldTemplate";
import { ArrayFieldTemplate } from "../../ArrayFieldTemplate";
import { ObjectFieldTemplate } from "../../ObjectFieldTemplate";

export default {
  title: "JSON Schema Form/Fields/Upload Field",
};

function onSubmit({ formData }: FormSubmit) {
  console.info("Submit:", formData);
}

export const UploadField = () => {
  const schema: JSONSchema7 = {
    type: "array",
    items: [
      {
        type: "object",
        description: "Does the company have XY?",
        required: ["answer"],
        properties: {
          name: {
            $ref: "#/$defs/const",
            default: "question_xy",
          },
          answer: {
            $ref: "#/$defs/yesNoUnknown",
          },
        },
      },
      {
        type: "object",
        description: "Please upload the legal documents for XY:",
        required: ["evidence"],
        properties: {
          name: {
            $ref: "#/$defs/const",
            default: "files_xy",
          },
          evidence: {
            $ref: "#/$defs/evidence",
          },
        },
      },
    ],
    $defs: {
      yesNoUnknown: {
        type: "string",
        oneOf: [
          {
            const: "yes",
            title: "Yes",
          },
          {
            const: "no",
            title: "No",
          },
          {
            const: "unknown",
            title: "Unknown",
          },
        ],
      },
      const: {
        type: "string",
        readOnly: true,
        default: "«value»",
      },
      evidence: {
        type: "array",
        default: [],
        items: {
          type: "object",
          properties: {
            uri: {
              type: "string",
            },
          },
        },
      },
    },
  };

  const uiSchema: UiSchema = {
    items: {
      name: {
        "ui:widget": "hidden",
      },
      answer: {
        "ui:widget": "radio",
        "ui:inline": true,
        "ui:label": false,
      },
      evidence: {
        "ui:field": "CustomUploadField",
      },
    },
  };

  return (
    <JsonSchemaForm
      {...{
        FieldTemplate,
        ArrayFieldTemplate,
        ObjectFieldTemplate,
        fields: {
          CustomUploadField: UploadFieldComp,
        },
        schema,
        uiSchema,
        onSubmit,
      }}
    />
  );
};
