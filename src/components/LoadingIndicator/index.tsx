import { MouseEventHandler } from "react";
import { CircularProgress, Tooltip, IconButton, useTheme } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export interface LoadingIndicatorProps {
  isLoading: boolean;
  refresh: MouseEventHandler<HTMLButtonElement>;
}

export default function LoadingIndicator({
  isLoading,
  refresh,
}: LoadingIndicatorProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  return isLoading ? (
    <CircularProgress
      color="inherit"
      sx={{ margin: 1.5 }}
      size={theme.spacing(2)}
      thickness={6}
    />
  ) : (
    <Tooltip title={t("refresh")}>
      <IconButton aria-label={t("refresh")} color="inherit" onClick={refresh}>
        <Refresh />
      </IconButton>
    </Tooltip>
  );
}
