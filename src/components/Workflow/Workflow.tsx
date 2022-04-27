import {
  Divider,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  StepperProps,
} from "@mui/material";
import { ReactNode } from "react";

export type WorkflowProps = {
  activeStep: StepperProps["activeStep"];
  children: StepperProps["children"];
  steps:
    | Array<{ id: string; label?: ReactNode; clickable?: boolean }>
    | Array<string>;
  stepperProps?: StepperProps;
  setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
} & StepperProps;

export function Workflow({
  steps: _steps,
  activeStep,
  children,
  setActiveStep,
}: WorkflowProps) {
  const steps = _steps.map((step) =>
    typeof step === "string" ? { id: step } : step
  );
  return (
    <>
      <Stepper {...{ activeStep }}>
        {steps.map(({ id, label, clickable }, i) => {
          return (
            <Step key={id}>
              {clickable && setActiveStep ? (
                <StepButton
                  sx={{ userSelect: "none" }}
                  onClick={() => setActiveStep(i)}
                >
                  {label ?? id}
                </StepButton>
              ) : (
                <StepLabel sx={{ userSelect: "none" }}>{label ?? id}</StepLabel>
              )}
            </Step>
          );
        })}
      </Stepper>
      <Divider sx={{ my: 1 }} />
      {children}
    </>
  );
}
