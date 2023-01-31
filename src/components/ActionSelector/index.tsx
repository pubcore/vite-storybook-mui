import {
  EventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Popover, Button, Tooltip, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface ActionSelectorProps {
  label?: string;
  children: ReactNode;
}

export default function ActionSelector({
  label,
  children,
}: ActionSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const onClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);
  const showPopover: MouseEventHandler<HTMLButtonElement> = useCallback(
    ({ currentTarget }) => {
      setAnchorEl(currentTarget);
    },
    []
  );
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  return (
    <div>
      <Tooltip title={label || t("select_actions")}>
        <Button color="primary" size="small" id="iojjty" onClick={showPopover}>
          {label || t("select_actions")}
        </Button>
      </Tooltip>
      <Popover
        onClick={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...{ open, onClose, anchorEl }}
      >
        <Box
          component="div"
          sx={{
            margin: 2,
            display: "flex",
            flexDirection: "column",
            "& > button, > div": {
              margin: 0.5,
            },
          }}
        >
          {children}
        </Box>
      </Popover>
    </div>
  );
}
