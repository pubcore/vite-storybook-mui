import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useTranslation } from "react-i18next";

export function RadioField(props: FieldProps) {
  const { t } = useTranslation();
  const { onChange } = props;

  return (
    <Box className="custom-widget radio-widget">
      <RadioGroup
        row
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
      >
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label={t("radio_yes")}
        />
        <FormControlLabel
          value="no"
          control={<Radio />}
          label={t("radio_no")}
        />
        <FormControlLabel
          value="unknown"
          control={<Radio />}
          label={t("radio_unknown")}
        />
      </RadioGroup>
    </Box>
  );
}
