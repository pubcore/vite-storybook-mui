import { ActionButton } from "./";

export default {
  title: "Buttons",
  argTypes: { refresh: { action: "refresh" } },
};

export const Default = () => (
    <ActionButton variant="outlined">Default</ActionButton>
  ),
  Primary = () => <ActionButton>Primary</ActionButton>,
  Secondary = () => <ActionButton color="secondary">Secondary</ActionButton>;
