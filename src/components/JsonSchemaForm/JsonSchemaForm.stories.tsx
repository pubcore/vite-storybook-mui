import { JsonSchemaForm } from "./";
import type { JSONSchema7 } from "json-schema";
import { Box } from "@mui/material";
import { ISubmitEvent, UiSchema } from "@rjsf/core";
import { useCallback, useMemo } from "react";

export default {
  title: "JSON Schema Form/Full Form",
};

const schema1: JSONSchema7 = {
  title: "Test form",
  type: "object",
  properties: {
    group: {
      type: "object",
      title: "Group Name",
      required: ["foo", "bar"],
      properties: {
        foo: {
          type: "object",
          title: "Custom MultiSelect",
          properties: {
            predefined: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "ISO-XY01",
                  "ISO-XY02",
                  "ISO-XY03",
                  "ISO-XY04",
                  "ISO-XY05",
                  "ISO-ABCDEFGHIJKLMNOPQRSTUVWXYZ-01",
                  "ISO-ABCDEFGHIJKLMNOPQRSTUVWXYZ-02",
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
        bar: {
          title: "Custom Radio",
          type: "string",
          enum: ["yes", "no", "unknown"],
        },
      },
    },
  },
};

const uiSchema1: UiSchema = {
  group: {
    foo: {
      "ui:field": "CustomMultiSelect",
      "ui:options": {
        helpUri: "http://africau.edu/images/default/sample.pdf",
      },
    },
    bar: {
      "ui:field": "CustomRadio",
    },
  },
};

// see https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-widgets-fields/
// const widgets: { [k: string]: Widget } = {
//   CustomMultiSelect: MultiSelectWidget,
//   CustomRadio: RadioWidget,
// };

// const uiSchema2: UiSchema = {
//   "ui:options": {
//     inline: true,
//   },
// };

// see https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-widgets-fields/
// const fields1: { [k: string]: Field } = {};

export const Default = () => (
  <Box sx={{ width: 600, padding: 2 }}>
    <JsonSchemaForm
      {...{
        onSubmit: ({ formData }) => console.info("Form submitted:", formData),
        schema: schema1,
        uiSchema: uiSchema1,
      }}
    />
  </Box>
);

export const Advanced = () => {
  const schema2 = useMemo<JSONSchema7>(
    () => ({
      title: "",
      type: "object",
      required: ["mfr", "cer"],
      properties: {
        mfr: {
          type: "object",
          title: "Manufacturing (MFR)",
          required: [
            "mfr_product_datasheet",
            "mfr_due_diligence_eu_timber_regulation",
            "mfr_product_traceability",
          ],
          properties: {
            mfr_product_datasheet: {
              title:
                "Is product manufacturing defined with a product data sheet?",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            mfr_due_diligence_eu_timber_regulation: {
              title:
                "Do you have a system of due diligence regarding the EU regulation on timber (Regulation (EU) n° 995/2010) if you are a marketer in Europe?",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            mfr_product_traceability: {
              title:
                "Do you have a product traceability system in place throughout the production chain?",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
          },
        },
        cer: {
          type: "object",
          title: "Environmental commitment (CER)",
          required: [
            "cer_environmental_procedures",
            "cer_measures_reduce_energy_consumption",
            "cer_waste_treatment_system",
            "cer_using_recovered_energy",
            "cer_reduced_resource_use",
            "cer_waste_reduction",
          ],
          properties: {
            cer_environmental_procedures: {
              type: "object",
              title:
                "Does the manufacturing plant and / or the assembly unit have one of the following environmental procedures?",
              properties: {
                predefined: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "EN ISO 14001",
                      "EN ISO 14005",
                      "EN ISO 14024",
                      "EN ISO 50001",
                      "EMAS-VO",
                      "Ried'ENVOL",
                      "Green Mark",
                      "Equivalent",
                      "Non certified Environmental Management System",
                      "Environmental charter incorporating the company's environmental commitments",
                      "Measures to limit its environmental impacts",
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
            cer_measures_reduce_energy_consumption: {
              title:
                "Has the manufacturing plant and / or the assembly unit put in place measures to reduce the energy consumption of the production sites?",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            cer_waste_treatment_system: {
              title:
                "Does the production and / or assembly plant have a waste treatment system in place?",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            cer_using_recovered_energy: {
              title: "Is the product manufactured using recovered energy?",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            cer_reduced_resource_use: {
              title: "Reduced resource use (during production or distribution)",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
            cer_waste_reduction: {
              title: "Waste reduction (during production, distribution or use)",
              type: "string",
              enum: ["yes", "no", "unknown"],
            },
          },
        },
        confirmation: {
          type: "boolean",
        },
      },
    }),
    []
  );

  const uiSchema2 = useMemo<UiSchema>(
    () => ({
      mfr: {
        mfr_product_datasheet: {
          "ui:field": "CustomRadio",
        },
        mfr_due_diligence_eu_timber_regulation: {
          "ui:field": "CustomRadio",
        },
        mfr_product_traceability: {
          "ui:field": "CustomRadio",
        },
      },
      cer: {
        cer_environmental_procedures: {
          "ui:field": "CustomMultiSelect",
          "ui:options": {
            helpUri: "http://africau.edu/images/default/sample.pdf",
          },
        },
        cer_measures_reduce_energy_consumption: {
          "ui:field": "CustomRadio",
        },
        cer_waste_treatment_system: {
          "ui:field": "CustomRadio",
        },
        cer_using_recovered_energy: {
          "ui:field": "CustomRadio",
        },
        cer_reduced_resource_use: {
          "ui:field": "CustomRadio",
        },
        cer_waste_reduction: {
          "ui:field": "CustomRadio",
        },
      },
      confirmation: {
        "ui:field": "CustomFooter",
      },
    }),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback(({ formData }: ISubmitEvent<any>) => {
    console.log("SUBMIT:", formData);
  }, []);

  // const theme = useTheme();

  return (
    <Box sx={{ width: 1200, padding: 2 }}>
      <JsonSchemaForm
        {...{ schema: schema2, uiSchema: uiSchema2, onSubmit /*, theme*/ }}
      >
        <Box /> {/* To disable the default "submit" button */}
      </JsonSchemaForm>
    </Box>
  );
};
