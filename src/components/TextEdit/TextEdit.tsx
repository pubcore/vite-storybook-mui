import { ReactNode, useCallback, useRef, useState } from "react";
import { KeyExtraction } from "./KeyExtraction";
import { isEnabled } from "./i18nextPlugin";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";

export function TextEdit({ children }: { children: ReactNode }) {
  const [textkeys, setTextkeys] = useState<string[]>([]);
  const { t } = useTranslation();
  const selectTextkeys = useCallback((textkeys: string[]) => {
    setTextkeys(textkeys);
  }, []);
  return isEnabled ? (
    <>
      <KeyExtraction {...{ selectTextkeys }}>{children}</KeyExtraction>
      {!!textkeys.length && (
        <Dialog open={true} PaperComponent={PaperComponent}>
          <div style={{ cursor: "move" }} id="dialog-drag-handle">
            <DialogTitle>{t("uiTextEdit_title")}</DialogTitle>
          </div>
          <DialogContent>test</DialogContent>
          <DialogActions>
            <Button onClick={() => setTextkeys([])} variant="outlined">
              {t("cancle")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  ) : (
    <>{children}</>
  );
}

function PaperComponent(props: PaperProps) {
  const nodeRef = useRef(null);
  return (
    <Draggable handle="#dialog-drag-handle" nodeRef={nodeRef}>
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  );
}
