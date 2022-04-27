import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useTranslation } from "react-i18next";

export function RadioField(props: FieldProps) {
  const { t } = useTranslation();
  const { onChange, schema } = props;
  const values = schema?.enum ?? ["yes", "no", "unknown"];

  const items = values.map((value, i) => (
    <FormControlLabel
      {...{
        value,
        control: <Radio />,
        label: (
          <Box sx={{ userSelect: "none" }}>{t(`radio_${value}` as "_")}</Box>
        ),
        ...(i === values.length - 1 ? { sx: { marginRight: 0 } } : {}),
      }}
      key={String(value)}
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
