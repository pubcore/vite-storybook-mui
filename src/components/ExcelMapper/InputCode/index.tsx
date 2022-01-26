import { TextField, TextFieldProps } from "@mui/material";

export type InputCodeProps = {
  errorText?: string;
  helperText?: string;
  name: string;
} & TextFieldProps;

export function InputCode({ ...rest }: InputCodeProps) {
  return (
    <TextField fullWidth size="small" minRows={1} multiline={true} {...rest} />
  );
}
