import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  SxProps,
  RadioProps,
} from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function RadioField({ onChange }: FieldProps) {
  const { t } = useTranslation();

  // const error = Array.isArray(rawErrors) && rawErrors.length > 0;

  const getLabel = useCallback(
    (key: string) => <Box sx={{ userSelect: "none" }}>{t(key as "_")}</Box>,
    [t]
  );

  return (
    <Box className="custom-widget radio-widget">
      <RadioGroup
        row
        className="radio-group"
        onChange={({ currentTarget: { value } }) => onChange(value)}
        sx={{ flexWrap: "nowrap" }}
      >
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label={getLabel("radio_yes")}
        />
        <FormControlLabel
          value="no"
          control={<Radio />}
          label={getLabel("radio_no")}
        />
        <FormControlLabel
          value="unknown"
          control={<Radio />}
          label={getLabel("radio_unknown")}
          sx={{ marginRight: 0 }}
        />
      </RadioGroup>
    </Box>
  );
}
