import { ActionButton } from "..";
import ActionBar from "./";

export default {
  title: "Action bar",
};

export const Default = () => (
  <ActionBar>
    Title
    <ActionButton>save</ActionButton>
  </ActionBar>
);
