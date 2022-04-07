import {
  DialogProps as MuiDialogProps,
  DialogTitle,
  Dialog as MuiDialog,
} from "@mui/material";
import { ReactNode } from "react";

export type DialogProps = {
  title?: ReactNode;
  children: ReactNode;
} & MuiDialogProps;

export function Dialog({ title, children, ...rest }: DialogProps) {
  return (
    <MuiDialog {...rest} aria-labelledby="modal-modal-title">
      {title ? <DialogTitle id="modal-modal-title">{title}</DialogTitle> : null}
      {children}
    </MuiDialog>
  );
}
