import { Outlet, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { ErrorBoundary } from "./ErrorBoundary";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

export interface PageProps {
  appBar: ReactNode;
  sidebar: ReactNode;
  notification: ReactNode;
  contentMaxWidth?: number;
}

export default function Page({
  appBar,
  sidebar,
  notification,
  contentMaxWidth,
}: PageProps) {
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
        <>{appBar}</>
        <Box
          component="main"
          sx={{
            display: "flex",
            flexGrow: 1,
            position: "relative",
          }}
        >
          <>{sidebar}</>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexGrow: 1,
              flexBasis: 0,
              padding: { xs: 0, md: 1 },
              paddingBottom: 1,
              maxWidth: contentMaxWidth,
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
              {t("footer_copyright", "{{date}}", {
                date: new Date().getFullYear(),
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
      <>{notification}</>
    </Box>
  );
}
