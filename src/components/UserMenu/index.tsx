import { useState, ReactNode, SyntheticEvent } from "react";
import { Tooltip, IconButton, Menu, Button, Avatar } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import Logout from "../Logout";

const label = "user_menu";

export interface UserMenuProps {
  user?:
    | { avatarUri?: string; fullName: string; username: string }
    | Record<string, never>;
  logout: () => void;
  children: ReactNode;
}

export default function UserMenu({
  user = {},
  logout,
  children,
}: UserMenuProps) {
  const { t } = useTranslation();
  const { avatarUri, fullName, username } = user;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleMenu = (event: SyntheticEvent) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isOpen = Boolean(anchorEl);

  return (
    <div>
      {username ? (
        <Button
          sx={{ textTransform: "none" }}
          id={"ukgdhz"}
          aria-label={t(label)}
          color="inherit"
          startIcon={
            avatarUri ? (
              <Avatar
                src={avatarUri}
                alt={fullName}
                sx={{
                  width: 4,
                  height: 4,
                }}
              />
            ) : (
              <AccountCircle />
            )
          }
          onClick={handleMenu}
          variant="text"
        >
          {username}
        </Button>
      ) : (
        <Tooltip title={t(label)}>
          <IconButton
            aria-label={t(label)}
            aria-owns={isOpen ? "menu-appbar" : undefined}
            aria-haspopup={true}
            color="inherit"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        id="menu-appbar"
        disableScrollLock
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        // Make sure the menu is display under the button and not over the appbar
        // See https://material-ui.com/components/menus/#customized-menus
        open={isOpen}
        onClose={handleClose}
      >
        {children}
        <Logout {...{ logout }} />
      </Menu>
    </div>
  );
}
