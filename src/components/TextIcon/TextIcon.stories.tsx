import { TextIcon } from "../";
import { RemoveCircleOutline } from "@mui/icons-material";
import { red } from "@mui/material/colors";

export default {
  title: "Text icon",
};

export const Default = () => (
  <TextIcon
    {...{ Icon: RemoveCircleOutline, text: "not allowed", muiColor: red }}
  />
);
