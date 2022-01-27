import { ReactNode, useCallback } from "react";
import {
  AppBar as MuiAppBar,
  Tooltip,
  useMediaQuery,
  Slide,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTranslation } from "react-i18next";

export interface AppBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  loadingIndicator: ReactNode;
  userMenu: ReactNode;
  children: ReactNode;
}

export default function AppBar({
  isOpen,
  toggleSidebar,
  loadingIndicator,
  userMenu,
  children,
}: AppBarProps) {
  const { transitions, breakpoints } = useTheme();
  const scrollTrigger = useScrollTrigger();
  const isXSmall = useMediaQuery(breakpoints.down("xs"));
  const { t } = useTranslation();
  const onClick = useCallback(() => toggleSidebar(), [toggleSidebar]);

  return (
    <Slide appear={false} direction="down" in={!scrollTrigger}>
      <MuiAppBar color="secondary" enableColorOnDark={true}>
        <Toolbar
          sx={{ paddingRight: 2 }}
          disableGutters
          variant={isXSmall ? "regular" : "dense"}
        >
          <Tooltip
            title={t(isOpen ? "close_menu" : "open_menu", "Open/Close menu")}
            enterDelay={1000}
          >
            <IconButton
              sx={{ marginLeft: 1, marginRight: 1 }}
              color="inherit"
              {...{ onClick }}
            >
              <MenuIcon
                sx={{
                  transition: transitions.create(["transform"], {
                    easing: transitions.easing.sharp,
                    duration: transitions.duration.leavingScreen,
                  }),
                  transform: `rotate(${isOpen ? 180 : 0}deg)`,
                }}
                {...{ open: isOpen }}
              />
            </IconButton>
          </Tooltip>
          <Typography
            component="div"
            sx={{
              flexGrow: 1,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            variant="h6"
            color="inherit"
          >
            {children}
          </Typography>
          <>{loadingIndicator}</>
          <>{userMenu}</>
        </Toolbar>
      </MuiAppBar>
    </Slide>
  );
}
