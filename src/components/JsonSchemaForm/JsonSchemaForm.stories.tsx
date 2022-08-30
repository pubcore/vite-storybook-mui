import { JsonSchemaForm } from "./";
import type { JSONSchema7 } from "json-schema";
import { UiSchema } from "@rjsf/core";
import schemaJson from "./exampleSchema.json";
import uiSchemaJson from "./exampleUiSchema.json";

export default {
  title: "JSON Schema Form/Full Form",
};

export const PredefinedValues = () => {
  const schema = schemaJson as JSONSchema7;
  const uiSchema = uiSchemaJson as UiSchema;

  type PredefFormData = {
    groups: Array<{
      name: string;
      claims: Array<
        | {
            name: string;
            certificates: { custom: string[]; predefined: string[] };
          }
        | { name: string; answer: string }
        | { name?: string; file?: string }
      >;
    }>;
    confirmed?: boolean;
  };

  const formData: PredefFormData = {
    groups: [
      {
        name: "groupA",
        claims: [
          {
            name: "firstQuestion",
            answer: "yes",
          },
        ],
      },
      {
        name: "groupB",
        claims: [
          {
            name: "firstQuestion",
            certificates: {
              predefined: ["ISO-XY04", "ISO-ABCDEFGHIJKLMNOPQRSTUVWXYZ-01"],
              custom: [],
            },
          },
          {
            name: "secondQuestion",
            answer: "now",
          },
          {},
        ],
      },
    ],
    confirmed: true,
  };

  return (
    <JsonSchemaForm<PredefFormData>
      {...{
        onSubmit: ({ formData }) => console.info("Form submitted:", formData),
        schema,
        uiSchema,
        formData,
      }}
    />
  );
};

export const SomeDefaultFields = () => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {
      pArray: {
        title: "Multiselect (array)",
        type: "array",
        uniqueItems: true,
        items: { type: "string", enum: ["Mercure", "Venus", "Earth", "Mars"] },
      },
      pBoolean: {
        title: "Boolean",
        type: "boolean",
      },
      pNull: {
        title: "Null",
        type: "null",
      },
      pNumber: {
        title: "Number",
        type: "number",
      },
      pString: {
        title: "String",
        type: "string",
      },
    },
  };

  return <JsonSchemaForm {...{ schema }} />;
};
