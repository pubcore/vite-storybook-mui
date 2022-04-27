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
    type: "object",
    properties: {
      group1: {
        type: "object",
        title: "Group One",
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
            title:
              "Sit pariatur ullamco culpa culpa eiusmod occaecat aliquip ullamco aute velit occaecat tempor aliqua minim. Veniam aliquip irure voluptate cillum anim ex amet deserunt. Voluptate Lorem aliqua nisi ullamco.",
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
      group2: {
        title: "Group Two (default fields)",
        type: "object",
        properties: {
          foo: {
            title: "Hello",
            type: "string",
          },
        },
      },
    },
  };

  const uiSchema: UiSchema = {
    group1: {
      foo: {
        "ui:field": "CustomMultiSelect",
        "ui:options": {
          helpUri: "sample.pdf",
        },
      },
      bar: {
        "ui:field": "CustomRadio",
        "ui:options": {
          helpUri: "sample.pdf",
        },
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

export const TwoSteps = () => {
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

  const firstProps: { schema: JSONSchema7; uiSchema: UiSchema } = {
    schema: {
      type: "object",
      required: [],
      properties: {
        test: {
          title: "Custom Radio",
          type: "string",
          enum: ["yes", "no", "unknown"],
        },
        confirmation: {
          type: "boolean",
        },
      },
    },
    uiSchema: {
      test: {
        "ui:field": "CustomRadio",
      },
      confirmation: {
        "ui:field": "CustomFooter",
      },
    },
  };

  const secondProps: { schema: JSONSchema7; uiSchema: UiSchema } = {
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
          <JsonSchemaForm {...{ ...firstProps, onSubmit }}>
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
            ...secondProps,
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
