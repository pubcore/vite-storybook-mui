import { Workflow } from "./Workflow";

export default {
  title: "Workflow stepper",
};

export const Default = () => (
  <Workflow {...{ steps: ["upload", "review", "confirm"], activeStep: 1 }}>
    «children»
  </Workflow>
);
