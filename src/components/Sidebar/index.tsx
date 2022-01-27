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
      return isActive
        ? {
            color: text.primary,
            textDecoration: "none",
            backgroundImage: `linear-gradient(to right, ${secondary.main} 20%, ${background.default} 75%)`,
          }
        : { color: text.secondary };
    },
    [palette]
  );

  return (
    <Drawer
      sx={{
        ".MuiDrawer-paper": {
          position: "relative",
          height: 1,
          overflowX: "hidden",
          width: isOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
          transition: transitions.create("width", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
          }),
          backgroundColor: { xs: "rgba(75,75,75,0.85)", sm: "transparent" },
          borderRight: "none",
          zIndex: "inherit",
          marginRight: 1,
          md: { border: "none" },
          [breakpoints.down("sm")]: {
            marginTop: 0,
            height: "100vh",
            position: "inherit",
            backgroundColor: "background.default",
          },
        },
      }}
      {...{ variant, onClose }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          marginTop: {
            xs: 0,
            md: 1,
          },
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
