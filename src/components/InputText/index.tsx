import {
  TextField as MuiTextField,
  TextFieldProps,
  styled,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";

export type InputTextProps = {
  register: UseFormReturn["register"];
  errorText?: string;
  helperText?: string;
  name: string;
} & TextFieldProps;

const TextField = styled(MuiTextField)(({ theme: { spacing } }) => ({
  marginBottom: spacing(1),
  //fix "blue background" issue with safari, if a "autofill value" is used
  "& .MuiInputBase-input": {
    "&:-webkit-autofill": {
      "-webkit-box-shadow": "0 0 0 100px rgb(0, 0, 0, 0) inset",
      transition: "background-color 5000s ease-in-out 0s",
    },
  },
}));

export default function InputText({
  register,
  errorText,
  helperText,
  ...rest
}: InputTextProps) {
  const { name, label } = rest;
  return (
    <TextField
      color="secondary"
      size="small"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      variant="outlined"
      {...{
        id: `agopba-${
          typeof label === "string" ? label.replace(/\s/g, "_") : "text_field"
        }`,
        error: Boolean(errorText),
        inputProps: register(name),
        helperText: errorText || helperText || " ",
        ...rest,
      }}
    />
  );
}
