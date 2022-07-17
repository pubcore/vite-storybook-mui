import { Box } from "@mui/material";
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

export const Alignments = () => {
  const getCont = (txt: string) => (
    <>
      <Box sx={{ margin: 2 }}>{txt}</Box>
      <ActionButton>button</ActionButton>
    </>
  );
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <ActionBar>{getCont("Default")}</ActionBar>
      <ActionBar sx={{ flexDirection: "row" }}>{getCont("Left")}</ActionBar>
      <ActionBar sx={{ flexDirection: "row-reverse" }}>
        {getCont("Right")}
      </ActionBar>
    </Box>
  );
};
