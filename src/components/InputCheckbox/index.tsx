import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

export interface InputCheckboxProps {
  form: UseFormReturn;
  name: string;
  label?: string;
  defaultValue?: string | number | boolean;
}

export default function InputCheckbox({
  form,
  name,
  label,
  defaultValue,
}: InputCheckboxProps) {
  const control = (
    <Controller
      {...{
        name,
        control: form.control,
        defaultValue,
        render({ field: { value, onChange, ...rest } }) {
          return (
            <Checkbox
              {...{
                size: "small",
                checked: value ?? defaultValue ?? false,
                ...rest,
                onChange: (e) => onChange(e.target.checked),
              }}
            />
          );
        },
      }}
    />
  );

  return label ? <FormControlLabel {...{ label, control }} /> : control;
}
