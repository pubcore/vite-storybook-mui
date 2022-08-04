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
  steps: (
    | {
        id: string;
        label?: ReactNode;
        clickable?: boolean;
        clickableWhenCompleted?: boolean;
      }
    | string
  )[];
  activeStep: StepperProps["activeStep"];
  setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
  completedSteps?: Set<number>;
  nonLinear?: boolean;
  stepperProps?: StepperProps;
  children: StepperProps["children"];
} & StepperProps;

const emptyObject = {};
const emptySet = new Set<number>();

export function Workflow({
  steps: _steps,
  activeStep,
  setActiveStep,
  nonLinear = false,
  stepperProps = emptyObject,
  completedSteps = emptySet,
  children,
}: WorkflowProps) {
  const steps = _steps.map((step) =>
    typeof step === "string" ? { id: step } : step
  );
  return (
    <>
      <Stepper {...{ ...stepperProps, activeStep, nonLinear }}>
        {steps.map(({ id, label, clickable, clickableWhenCompleted }, i) => {
          const completed = completedSteps.has(i);
          return (
            <Step key={id} {...{ completed }}>
              {setActiveStep &&
              (clickable ||
                (clickableWhenCompleted && completed) ||
                ((clickable || clickableWhenCompleted) &&
                  completedSteps.has(i - 1))) ? (
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
