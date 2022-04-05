import { Divider, Step, StepLabel, Stepper, StepperProps } from "@mui/material";
import { ReactNode } from "react";

export type WorkflowProps = {
  activeStep: StepperProps["activeStep"];
  children: StepperProps["children"];
  steps: Array<{ id: string; label?: ReactNode }> | Array<string>;
  stepperProps?: StepperProps;
} & StepperProps;

export function Workflow({
  steps: _steps,
  activeStep,
  children,
}: WorkflowProps) {
  const steps = _steps.map((step) =>
    typeof step === "string" ? { id: step } : step
  );
  return (
    <>
      <Stepper {...{ activeStep }}>
        {steps.map(({ id, label }) => {
          return (
            <Step key={id}>
              <StepLabel>{label ?? id}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Divider sx={{ my: 1 }} />
      {children}
    </>
  );
}
