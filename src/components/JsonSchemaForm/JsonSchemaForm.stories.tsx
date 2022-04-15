import { JsonSchemaForm } from "./";
import type { JSONSchema7 } from "json-schema";
import { Box, Button } from "@mui/material";
import { ISubmitEvent, UiSchema } from "@rjsf/core";
import { useCallback, useMemo, useState } from "react";
import { Workflow } from "../Workflow/Workflow";

export default {
  title: "JSON Schema Form/Full Form",
};

// const widgets: { [k: string]: Widget } = {}; // see https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-widgets-fields/

// const fields1: { [k: string]: Field } = {}; // see https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/custom-widgets-fields/

export const PredefinedValues = () => {
  const schema: JSONSchema7 = {
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
            title: "Custom Radio 1",
            type: "string",
            enum: ["yes", "no", "unknown"],
          },
          baz: {
            title: "Custom Radio 2",
            type: "string",
            enum: ["yes", "also_yes"],
          },
        },
      },
    },
  };

  const uiSchema: UiSchema = {
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
      baz: {
        "ui:field": "CustomRadio",
      },
    },
  };

  type PredefFormData = {
    foo: { custom: string[]; predefined: string[] };
    bar: string;
    baz: string;
  };

  const formData: Partial<PredefFormData> = {
    foo: {
      predefined: ["pre1", "pre2", "pre3"],
      custom: [],
    },
    baz: "also_yes",
  };

  return (
    <Box sx={{ width: 600, padding: 2 }}>
      <JsonSchemaForm<PredefFormData>
        {...{
          onSubmit: ({ formData }) => console.info("Form submitted:", formData),
          schema,
          uiSchema,
          formData: formData as PredefFormData,
        }}
      />
    </Box>
  );
};

const getAdvancedProps = (): { schema: JSONSchema7; uiSchema: UiSchema } => ({
  schema: {
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
        const: true,
      },
    },
  },
  uiSchema: {
    mfr: {
      mfr_product_datasheet: {
        "ui:field": "CustomRadio",
      },
      mfr_due_diligence_eu_timber_regulation: {
        "ui:field": "CustomRadio",
        "ui:options": {
          helpUri:
            "https://uwaterloo.ca/onbase/sites/ca.onbase/files/uploads/files/samplecertifiedpdf.pdf",
        },
      },
      mfr_product_traceability: {
        "ui:field": "CustomRadio",
        "ui:options": {
          helpUri: "http://africau.edu/images/default/sample.pdf",
        },
      },
    },
    cer: {
      cer_environmental_procedures: {
        "ui:field": "CustomMultiSelect",
        "ui:options": {
          helpUri:
            "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf",
        },
      },
      cer_measures_reduce_energy_consumption: {
        "ui:field": "CustomRadio",
        "ui:options": {
          helpUri:
            "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
        },
      },
      cer_waste_treatment_system: {
        "ui:field": "CustomRadio",
      },
      cer_using_recovered_energy: {
        "ui:field": "CustomRadio",
      },
      cer_reduced_resource_use: {
        "ui:field": "CustomRadio",
        "ui:options": {
          helpUri:
            "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      },
      cer_waste_reduction: {
        "ui:field": "CustomRadio",
      },
    },
    confirmation: {
      "ui:field": "CustomFooter",
    },
  },
});

export const Advanced = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback(({ formData }: ISubmitEvent<any>) => {
    console.log("SUBMIT:", formData);
  }, []);

  // const theme = useTheme();
  const advProps = getAdvancedProps();

  return (
    <Box sx={{ width: 800, padding: 2 }}>
      <JsonSchemaForm {...{ ...advProps, onSubmit /*, theme*/ }}>
        <Box sx={{ display: "none" }} />
        {/* Empty child to disable the default submit button */}
      </JsonSchemaForm>
    </Box>
  );
};

export const TwoSteps = () => {
  const advProps = getAdvancedProps();

  const steps = useMemo(
    () => [
      { id: "Add Information", clickable: true },
      { id: "Provide Certifications", clickable: true },
    ],
    []
  );

  const [activeStep, setActiveStep] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback(({ formData }: ISubmitEvent<any>) => {
    console.log("SUBMIT 1st step:", formData);
    formData.confirmation === true && setActiveStep(1);
  }, []);

  const certProps: { schema: JSONSchema7; uiSchema: UiSchema } = {
    schema: {
      type: "object",
      required: [],
      properties: {
        test: {
          title: "test title",
          type: "string",
        },
        confirmation: {
          type: "boolean",
        },
      },
    },
    uiSchema: {
      test: {
        "ui:field": "CustomUpload",
      },
      confirmation: {
        "ui:field": "CustomFooter",
      },
    },
  };

  let stepContent = null;
  switch (activeStep) {
    case 0: // add information
      stepContent = (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setActiveStep(1)}
          >
            DBG: next
          </Button>
          <JsonSchemaForm {...{ ...advProps, onSubmit }}>
            <Box sx={{ display: "none" }} />
            {/* Empty child to disable the default submit button */}
          </JsonSchemaForm>
        </>
      );
      break;
    case 1: // provide certifications
      stepContent = (
        <JsonSchemaForm
          {...{
            ...certProps,
            onSubmit: ({ formData }) =>
              console.log("SUBMIT 2nd step:", formData),
          }}
        >
          <Box sx={{ display: "none" }} />
          {/* Empty child to disable the default submit button */}
        </JsonSchemaForm>
      );
      break;
  }

  return (
    <Box sx={{ width: 800, padding: 2 }}>
      <Workflow {...{ activeStep, setActiveStep, steps, stepsClickable: true }}>
        {stepContent}
      </Workflow>
    </Box>
  );
};

export const AllDefaultFields = () => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {
      pArray: {
        title: "Array",
        type: "array",
        items: {
          type: "string",
        },
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

  return (
    <JsonSchemaForm {...{ schema }}>
      <Box sx={{ display: "none" }} />
      {/* Empty child to disable the default submit button */}
    </JsonSchemaForm>
  );
};
