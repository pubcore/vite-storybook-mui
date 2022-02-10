import { Box } from "@mui/material";
import { TextIcon, TextIconProps } from "..";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import { red, green } from "@mui/material/colors";

const boxProps = {
  display: "flex",
  justifyContent: "center",
  p: 1,
  my: 2,
  border: 1,
  borderRadius: 7,
  bgcolor: "background.paper",
};

export type StatusProps = {
  text: TextIconProps["text"];
  severity: "error" | "info";
};

const muiColor = {
  error: red,
  info: green,
};

const icon = {
  error: ErrorIcon,
  info: CheckIcon,
};

export default function Status({ text, severity }: StatusProps) {
  return (
    <Box id="shdguj" {...{ ...boxProps, borderColor: muiColor[severity][500] }}>
      <TextIcon
        {...{
          muiColor: muiColor[severity],
          Icon: icon[severity],
          text,
        }}
      />
    </Box>
  );
}
