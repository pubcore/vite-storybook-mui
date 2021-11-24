import { useCallback } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface Message {
  textkey: string;
  args?: Record<string, unknown>;
  severity: AlertColor;
  autoHideDuration?: number;
}

export interface NotificationProps {
  message: Message;
  notified: () => void;
}

export default function Notification({ message, notified }: NotificationProps) {
  const {
    textkey,
    args = {},
    severity,
    autoHideDuration = 4000,
  } = message || {};
  const onClose = useCallback(() => notified(), [notified]);
  const { t } = useTranslation();

  return (
    <Snackbar
      {...{
        anchorOrigin: { vertical: "top", horizontal: "right" },
        open: Boolean(textkey),
        autoHideDuration,
        onClose,
        id: "llxiek-" + severity,
      }}
    >
      <Alert {...{ onClose, severity }}>{t(textkey as "_", args)}</Alert>
    </Snackbar>
  );
}
