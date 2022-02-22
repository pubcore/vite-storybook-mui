import {
  DialogProps as MuiDialogProps,
  DialogTitle,
  Dialog as MuiDialog,
} from "@mui/material";
import { ReactNode } from "react";

export type DialogProps = {
  title: ReactNode;
  children: ReactNode;
} & MuiDialogProps;

export default function Dialog({ title, children, ...rest }: DialogProps) {
  return (
    <MuiDialog
      {...rest}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="modal-modal-title">{title}</DialogTitle>
      {children}
    </MuiDialog>
  );
}
