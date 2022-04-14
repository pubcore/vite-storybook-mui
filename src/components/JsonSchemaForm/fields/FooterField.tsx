import { Box, FormControlLabel, Checkbox } from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../Button";

export function FooterField(props: FieldProps) {
  const { t } = useTranslation();
  const { onChange } = props;

  return (
    <Box
      className="custom-field footer-field"
      sx={{ display: "flex", justifyContent: "space-around", width: "100%" }}
    >
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={false}
              onChange={({ currentTarget: { checked } }) => onChange(checked)}
            />
          }
          label={
            <Box sx={{ userSelect: "none" }}>{t("confirm_data_correct")}</Box>
          }
          sx={{ marginRight: 6 }}
        />
        <ActionButton type="submit" variant="contained" size="large">
          {t("next_step")}
        </ActionButton>
      </Box>
    </Box>
  );
}
