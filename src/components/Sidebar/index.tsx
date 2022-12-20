import { ReactNode, useCallback, useEffect, useState } from "react";
import { useMediaQuery, Drawer, Box, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLinkItem } from "./NavLinkItem";

export interface Item {
  name: string;
  icon?: ReactNode;
  to?: string;
  subItems?: Item[];
  defaultOpen?: boolean;
}
export interface SidebarProps {
  items: Item[];
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}
const DRAWER_WIDTH = 240;
const CLOSED_DRAWER_WIDTH = 55;

export default function Sidebar({
  items,
  isOpen,
  toggle,
  close,
}: SidebarProps) {
  const { breakpoints, transitions, palette } = useTheme();
  const isXSmall = useMediaQuery(breakpoints.down("xs"));
  const isSmall = useMediaQuery(breakpoints.down("sm"));
  const variant = isXSmall ? "temporary" : "permanent";
  const [openItemNames, setOpenItemNames] = useState<string[]>([]);
  const { t } = useTranslation();

  const onItemClick = useCallback(() => {
    if (isSmall || isXSmall) {
      close();
    }
  }, [isXSmall, isSmall, close]);

  const onClose = useCallback(() => toggle(), [toggle]);

  const navLinkStyle = useCallback(
    ({ isActive, to }) => {
      const { secondary, text, background } = palette;

      return {
        display: "inline-block",
        width: "100%",
        textDecoration: "none",
        ...(isActive && to
          ? {
              color: text.primary,
              backgroundImage: `linear-gradient(to right, ${secondary.main} 20%, ${background.default} 75%)`,
            }
          : { color: text.secondary }),
      };
    },
    [palette]
  );

  const handleItemToggle = useCallback((name: string) => {
    setOpenItemNames((old) => {
      if (old.includes(name)) {
        return old.filter((val) => val !== name);
      } else {
        return [...old, name];
      }
    });
  }, []);

  useEffect(() => {
    const defaultOpenItemNames = items
      .filter((item) => item.defaultOpen)
      .map((item) => item.name);

    if (defaultOpenItemNames.length) {
      setOpenItemNames((old) => [...old, ...defaultOpenItemNames]);
    }
  }, [items]);

  const renderMenuItems = useCallback(
    (menuItems: Item[], subItem?: boolean) => {
      return menuItems.map((item) => {
        const { name, to } = item;

        return (
          <NavLinkItem
            subItem={subItem}
            style={(args) => navLinkStyle({ ...args, to })}
            isOpen={isOpen}
            isItemOpen={openItemNames.includes(name)}
            key={name}
            item={item}
            subItemsRenderer={renderMenuItems}
            onClick={onItemClick}
            onToggle={handleItemToggle}
          />
        );
      });
    },
    [handleItemToggle, isOpen, navLinkStyle, onItemClick, openItemNames]
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
        {renderMenuItems(items)}
      </Box>
    </Drawer>
  );
}
