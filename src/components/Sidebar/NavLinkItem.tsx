import { Item } from "src/components/Sidebar/index";
import {
  Box,
  Button,
  Collapse,
  ListItemIcon,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useCallback, MouseEvent, useMemo, useState } from "react";

interface Props extends Omit<NavLinkProps, "to"> {
  item: Item;
  isOpen?: boolean;
  isItemOpen?: boolean;
  subItemsRenderer: (menuItems: Item[], subItem?: boolean) => JSX.Element[];
  onToggle?: (name: string) => void;
  subItem?: boolean;
}

export function NavLinkItem({
  item: { name, icon, to, subItems },
  isOpen,
  subItemsRenderer,
  isItemOpen,
  onToggle,
  subItem,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);

  const isPopoverOpen = !!anchorEl;
  const popoverId = isPopoverOpen ? name : undefined;

  const hasChildren = useMemo(() => !!subItems?.length, [subItems?.length]);

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (hasChildren || !to) {
        event.preventDefault();
      }

      if (subItems?.length && onToggle) {
        onToggle(name);
      }

      if (rest.onClick) {
        rest.onClick(event);
      }
    },
    [hasChildren, name, onToggle, rest, subItems?.length, to]
  );

  const handlePopoverClick = (event: MouseEvent<HTMLSpanElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const menuItem = (
    <MenuItem tabIndex={0}>
      {icon && <ListItemIcon sx={{ minWidth: 5 }}>{icon}</ListItemIcon>}
      {isOpen || subItem ? t(name as "_") : ""}
    </MenuItem>
  );
  const subItemsContent = subItems?.length
    ? subItemsRenderer(subItems, true)
    : null;

  return (
    <>
      <NavLink {...rest} onClick={handleClick} to={to ?? ""}>
        {isOpen ? (
          menuItem
        ) : !hasChildren && !subItem ? (
          <Tooltip title={t(name as "_")} placement="right">
            {menuItem}
          </Tooltip>
        ) : (
          <>
            <span aria-describedby={popoverId} onClick={handlePopoverClick}>
              {menuItem}
            </span>
            {hasChildren && (
              <Popover
                id={popoverId}
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
              >
                <Box width="min-content">{subItemsContent}</Box>
              </Popover>
            )}
          </>
        )}
      </NavLink>
      {isOpen && (
        <Collapse in={isItemOpen}>
          <Box pl={1.5}>{subItemsContent}</Box>
        </Collapse>
      )}
    </>
  );
}
