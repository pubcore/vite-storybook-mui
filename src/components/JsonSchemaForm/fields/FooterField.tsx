import { Box, FormControlLabel, Checkbox } from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../Button";

export function FooterField(props: FieldProps) {
  const { t } = useTranslation();
  const { onChange } = props;

  console.log("footer field props", props);

  return (
    <Box
      className="custom-field footer-field"
      sx={{ display: "flex", justifyContent: "space-around", width: "100%" }}
    >
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              onChange={({ currentTarget }) => onChange(currentTarget.checked)}
            />
          }
          label={t("confirm_data_correct")}
          sx={{ marginRight: 6 }}
        />
        <ActionButton type="submit" variant="contained" size="large">
          {t("next_step")}
        </ActionButton>
      </Box>
    </Box>
  );
}
