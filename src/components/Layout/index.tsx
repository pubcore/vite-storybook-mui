import { Outlet, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { ErrorBoundary } from "./ErrorBoundary";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

export interface PageProps {
  appBar: ReactNode;
  sidebar: ReactNode;
  notification: ReactNode;
}

export default function Page({ appBar, sidebar, notification }: PageProps) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        zIndex: 1,
        minHeight: "100vh",
        backgroundColor: "background.default",
        position: "relative",
        minWidth: "fit-contnet",
        width: 1,
        color: "text.primary",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginTop: 6,
        }}
      >
        {appBar}
        <Box
          component="main"
          sx={{
            display: "flex",
            flexGrow: 1,
          }}
        >
          {sidebar}
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexGrow: 1,
              flexBasis: 0,
              padding: { xs: 2, sm: 0 },
              paddingLeft: { xs: 5, sm: 0 },
              paddingBottom: 1,
            }}
            id="main-content"
          >
            <ErrorBoundary
              errorText={t("javascript_error", "Sorry, something went wrong.")}
              key={pathname}
            >
              <Outlet />
            </ErrorBoundary>
            <Typography variant="subtitle2" color="textSecondary">
              {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      {notification}
    </Box>
  );
}
