import { useState } from "react";
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
    <Workflow
      {...{
        steps: [
          { id: "upload", clickable: true },
          { id: "review", clickable: true },
          { id: "confirm", clickable: true },
        ],
        activeStep,
        setActiveStep,
      }}
    >
      «children»
    </Workflow>
  );
};
