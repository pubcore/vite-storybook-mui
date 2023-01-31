import { UiSchema } from "@rjsf/utils";
import type { JSONSchema7 } from "json-schema";
import validator from "@rjsf/validator-ajv8";
import { HigherOrderField as HOField } from ".";
import { JsonSchemaForm } from "..";
import { MultiSelectField } from "../fields";

export default {
  title: "JSON Schema Form/Fields/Higher Order Field",
};

const onSubmit = ({ formData }: any) => console.log("## SUBMIT ##", formData);
export const OnlyRadio = () => {
  const schema: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "object",
    properties: {
      groups: {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              name: {
                $ref: "#/$defs/const",
                default: "mfr",
              },
              claims: {
                type: "array",
                title: "Manufacturing (MFR)",
                items: [
                  {
                    type: "object",
                    description:
                      "Is product manufacturing defined with a product data sheet?",
                    required: ["answer"],
                    properties: {
                      name: {
                        $ref: "#/$defs/const",
                        default: "product_datasheet",
                      },
                      answer: {
                        $ref: "#/$defs/yesNoUnknown",
                      },
                      evidence: {
                        $ref: "#/$defs/evidence",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
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
        type: "object",
        patternProperties: {
          ".+": {
            type: "array",
            items: {
              type: "object",
              properties: {
                uri: {
                  type: "string",
                },
                mimeType: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  };

  const uiSchema: UiSchema = {
    groups: {
      items: {
        name: {
          "ui:widget": "hidden",
        },
        claims: {
          items: {
            "ui:field": "HigherOrderField",
            // answer: {
            // },
          },
        },
      },
    },
  };

  const fields = {
    HigherOrderField: HOField,
  };

  return (
    <JsonSchemaForm
      {...{
        schema,
        validator,
        fields,
        uiSchema,
        onSubmit,
        formData: {
          groups: [
            {
              name: "mfr",
              claims: [
                {
                  name: "product_datasheet",
                  evidence: {},
                  answer: "unknown",
                },
              ],
            },
          ],
        },
      }}
    />
  );
};

export const RadioAndMultiselect = () => {
  const schema: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "object",
    properties: {
      groups: {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              name: {
                $ref: "#/$defs/const",
                default: "mfr",
              },
              claims: {
                type: "array",
                title: "Manufacturing (MFR)",
                items: [
                  {
                    type: "object",
                    description:
                      "Is product manufacturing defined with a product data sheet?",
                    required: ["answer"],
                    properties: {
                      name: {
                        $ref: "#/$defs/const",
                        default: "product_datasheet",
                      },
                      answer: {
                        $ref: "#/$defs/yesNoUnknown",
                      },
                      evidence: {
                        $ref: "#/$defs/evidence",
                      },
                    },
                  },
                  {
                    type: "object",
                    description:
                      "Does the manufacturing plant and / or the assembly unit have one of the following environmental procedures?",
                    required: ["items"],
                    properties: {
                      name: {
                        $ref: "#/$defs/const",
                        default: "environmental_procedures",
                        description: "/sample.pdf",
                      },
                      items: {
                        type: "object",
                        properties: {
                          predefined: {
                            type: "array",
                            minItems: 1,
                            uniqueItems: true,
                            items: {
                              type: "string",
                              enum: [
                                "EN ISO 14001",
                                "EN ISO 14005",
                                "EN ISO 14024",
                              ],
                            },
                          },
                          custom: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                      },
                      evidence: {
                        $ref: "#/$defs/evidence",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
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
        type: "object",
        patternProperties: {
          ".+": {
            type: "array",
            items: {
              type: "object",
              properties: {
                uri: {
                  type: "string",
                },
                mimeType: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  };

  const uiSchema: UiSchema = {
    groups: {
      items: {
        name: {
          "ui:widget": "hidden",
        },
        claims: {
          items: {
            "ui:field": "HigherOrderField",
            // answer: {
            // },
          },
        },
      },
    },
  };

  const fields = {
    HigherOrderField: HOField,
    CustomMultiSelect: MultiSelectField,
  };

  return (
    <JsonSchemaForm {...{ schema, fields, uiSchema, onSubmit, validator }} />
  );
};
