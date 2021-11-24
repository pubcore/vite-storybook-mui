import { ActionSelector } from "../";
import { ActionButton } from "../";

export default {
  title: "Action selector",
};

export const Default = () => (
  <ActionSelector>
    <ActionButton>create</ActionButton>
    <ActionButton>save</ActionButton>
  </ActionSelector>
);
