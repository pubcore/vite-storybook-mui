import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Dialog from "./Dialog";
import { ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/system";

export interface FormDialogProps {
  cancel: () => void;
  execute: (e: React.FormEvent) => void;
  name: string;
  isSubmitting?: boolean;
  children: ReactNode;
}

export default function FormDialog({
  cancel,
  execute,
  name,
  isSubmitting = false,
  children,
}: FormDialogProps) {
  const { t } = useTranslation();
  const handleCancel = useCallback(() => {
    cancel();
  }, [cancel]);
  const handleClose = useCallback(() => {
    cancel();
  }, [cancel]);
  const theme = useTheme();

  return (
    <Dialog
      fullWidth={true}
      open={true}
      onClose={handleClose}
      title={t((name + "_title") as "_")}
    >
      <form onSubmit={execute}>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {children}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" id="ahmalh-cancel" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button
            id="ahmalh-submit"
            type="submit"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <CircularProgress
                color="primary"
                size={theme.spacing(3)}
                thickness={8}
                sx={{ position: "absolute" }}
              />
            )}
            {t([(name + "_submit") as "_", name as "_"])}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
