import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";

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

  return (
    <Dialog
      fullWidth={true}
      open={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {t((name + "_title") as "_")}
      </DialogTitle>
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
            {t([(name + "_submit") as "_", name as "_"])}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
