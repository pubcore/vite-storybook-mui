import { ReactNode, useCallback } from "react";
import {
  MenuItem,
  Tooltip,
  useMediaQuery,
  Drawer,
  Box,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export interface Item {
  name: string;
  icon?: ReactNode;
  to: string;
}
export interface SidbarProps {
  items: Item[];
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}
const DRAWER_WIDTH = 240;
const CLOSED_DRAWER_WIDTH = 55;

export default function Sidebar({ items, isOpen, toggle, close }: SidbarProps) {
  const { breakpoints, transitions, palette } = useTheme();
  const isXSmall = useMediaQuery(breakpoints.down("xs"));
  const isSmall = useMediaQuery(breakpoints.down("sm"));
  const variant = isXSmall ? "temporary" : "permanent";
  const { t } = useTranslation();
  const onItemClick = useCallback(() => {
    if (isSmall || isXSmall) {
      close();
    }
  }, [isXSmall, isSmall, close]);
  const onClose = useCallback(() => toggle(), [toggle]);
  const navLinkStyle = useCallback(
    ({ isActive }) => {
      const { secondary, text, background } = palette;
      return {
        textDecoration: "none",
        ...(isActive
          ? {
              color: text.primary,
              backgroundImage: `linear-gradient(to right, ${secondary.main} 20%, ${background.default} 75%)`,
            }
          : { color: text.secondary }),
      };
    },
    [palette]
  );

  return (
    <Drawer
      sx={{
        ".MuiDrawer-paper": {
          position: { xs: "absolute", sm: "relative" },
          height: { xs: "100vh", sm: 1 },
          overflowX: "hidden",
          width: isOpen
            ? DRAWER_WIDTH
            : isSmall || isXSmall
            ? 0
            : CLOSED_DRAWER_WIDTH,
          transition: transitions.create("width", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
          }),
          backgroundColor: { xs: palette.background.paper, sm: "transparent" },
          borderRight: "none",
          zIndex: 1,
          marginRight: 1,
          border: { md: "none" },
        },
      }}
      {...{ variant, onClose }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          marginTop: { xs: 0, md: 1 },
          width: isOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
        }}
      >
        {items.map(({ name, icon, to }) => {
          //conditional wrap
          const menuItem = (
            <MenuItem tabIndex={0}>
              {icon && <ListItemIcon sx={{ minWidth: 5 }}>{icon}</ListItemIcon>}
              {isOpen ? t(name as "_") : ""}
            </MenuItem>
          );
          return (
            <NavLink
              style={navLinkStyle}
              key={name}
              onClick={onItemClick}
              {...{ to }}
            >
              {isOpen ? (
                menuItem
              ) : (
                <Tooltip title={t(name as "_")} placement="right">
                  {menuItem}
                </Tooltip>
              )}
            </NavLink>
          );
        })}
      </Box>
    </Drawer>
  );
}
