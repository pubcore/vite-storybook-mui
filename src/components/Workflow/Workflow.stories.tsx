import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { ActionButton } from "../Button";
import { Workflow } from "./Workflow";

export default {
  title: "Workflow stepper",
};

export const Default = () => (
  <Workflow {...{ steps: ["upload", "review", "confirm"], activeStep: 1 }}>
    «children»
  </Workflow>
);

export const Clickable = () => {
  const [activeStep, setActiveStep] = useState(2);
  return (
    <Box sx={{ margin: 2 }}>
      <Workflow
        {...{
          steps: [
            { id: "Clickable 0", clickable: true },
            { id: "Clickable 1", clickable: true },
            { id: "Not clickable 2", clickable: false },
          ],
          nonLinear: true,
          activeStep,
          setActiveStep,
        }}
      >
        <Box>Active step: {activeStep + 1}</Box>
        <ActionButton onClick={() => setActiveStep(activeStep + 1)}>
          Next
        </ActionButton>
      </Workflow>
    </Box>
  );
};

export const CustomCompletion = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());

  const steps = [
    {
      id: "Supplier Info",
      clickable: true,
    },
    { id: "Supplier Evidence", clickableWhenCompleted: true },
    { id: "Product", clickable: true },
  ];

  return (
    <Box sx={{ margin: 2 }}>
      <Workflow
        {...{
          steps,
          nonLinear: true,
          activeStep,
          setActiveStep,
          completedSteps,
        }}
      >
        <Typography variant="h5" sx={{ margin: 1 }}>
          Active step: {activeStep + 1}
        </Typography>
        <ActionButton
          onClick={() => {
            setActiveStep(Math.min(activeStep + 1, steps.length - 1));
            setCompletedSteps(
              new Set<number>([...completedSteps.values(), activeStep])
            );
          }}
        >
          Complete
        </ActionButton>
        <ActionButton
          onClick={() =>
            setActiveStep(Math.min(activeStep + 1, steps.length - 1))
          }
        >
          Skip
        </ActionButton>
        <ActionButton
          variant="outlined"
          onClick={() => {
            setActiveStep(0);
            setCompletedSteps(new Set<number>());
          }}
        >
          Reset
        </ActionButton>
      </Workflow>
    </Box>
  );
};
