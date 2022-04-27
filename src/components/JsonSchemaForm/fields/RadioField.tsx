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

export function RadioField(props: FieldProps) {
  const { t } = useTranslation();
  const { onChange, schema } = props;

  console.log("radiofield props", props);

  const values = schema?.enum ?? ["yes", "no", "unknown"];
  const trValues = values.map((v) => t(`radio_${v}` as "_"));

  // const error = Array.isArray(rawErrors) && rawErrors.length > 0;

  const getLabel = useCallback(
    (txt: string) => <Box sx={{ userSelect: "none" }}>{txt}</Box>,
    []
  );

  const items = values.map((value, i) => (
    <FormControlLabel
      {...{
        value,
        control: <Radio />,
        label: getLabel(trValues[i]),
        ...(i === values.length - 1 ? { sx: { marginRight: 0 } } : {}),
      }}
    />
  ));

  return (
    <Box className="custom-widget radio-widget">
      <RadioGroup
        row
        className="radio-group"
        onChange={({ currentTarget: { value } }) => onChange(value)}
        sx={{ flexWrap: "nowrap" }}
      >
        {items}
      </RadioGroup>
    </Box>
  );
}
