import { forwardRef } from "react";
import { ListItemIcon, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import ExitIcon from "@mui/icons-material/PowerSettingsNew";
import { useTranslation } from "react-i18next";

export interface LogoutProps {
  logout: () => void;
}

const LogoutWithRef = forwardRef<HTMLAnchorElement, LogoutProps>(
  function Logout({ logout }: LogoutProps, ref) {
    const { t } = useTranslation();
    const { breakpoints } = useTheme();
    const isXSmall = useMediaQuery(breakpoints.down("xs"));

    return (
      <MenuItem
        id={"zhjjdr"}
        {...{ onClick: logout }}
        ref={ref}
        component={isXSmall ? "span" : "li"}
        sx={{ color: "text.secondary" }}
      >
        <ListItemIcon sx={{ minWidth: 1 }}>
          <ExitIcon />
        </ListItemIcon>
        {t("logout")}
      </MenuItem>
    );
  }
);

export default LogoutWithRef;
