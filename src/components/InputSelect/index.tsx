import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  SelectProps,
} from "@mui/material";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

export interface InputSelectProps {
  errorText?: string;
  register: UseFormReturn["register"];
  children: ReactNode;
  name: string;
  label?: SelectProps["label"];
  helperText?: string;
  defaultValue?: SelectProps["defaultValue"];
}

export default function InputSelect({
  errorText,
  register,
  children,
  name,
  label,
  helperText,
  defaultValue,
}: InputSelectProps) {
  return (
    <FormControl
      {...{ error: Boolean(errorText) }}
      color="secondary"
      size="small"
      variant="outlined"
      sx={{
        minWidth: 150,
        maxWidth: 350,
      }}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        native
        {...{ label, defaultValue }}
        inputProps={{
          ...{ ...register(name), id: name },
        }}
      >
        {children}
      </Select>
      <FormHelperText>{errorText || helperText || ` `}</FormHelperText>
    </FormControl>
  );
}
