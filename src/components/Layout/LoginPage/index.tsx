import React, { ReactNode, useEffect, useState } from "react";
import { Card, Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material";

export interface LoginPageProps {
  login: ReactNode;
  help: ReactNode;
  backgroundImgUri?: string;
  logoUri: string;
}

export default function LoginPage({
  login,
  help,
  backgroundImgUri,
  logoUri,
}: LoginPageProps) {
  const [bgImage, setBgImage] = useState<null | string>(null);
  const { palette } = useTheme();
  useEffect(() => {
    let mounted = true;
    const lazyLoadBackgroundImage = () => {
      if (!bgImage && backgroundImgUri) {
        const img = new Image();
        img.onload = () => mounted && setBgImage(backgroundImgUri);
        img.src = backgroundImgUri;
      }
    };
    backgroundImgUri && lazyLoadBackgroundImage();
    return () => {
      mounted = false;
    };
  }, [bgImage, backgroundImgUri]);

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundImage: bgImage
          ? `url(${bgImage})`
          : `radial-gradient(
        circle at 50% 14em,
        ${palette.secondary.light} 0%,
        ${palette.secondary.dark} 80%,
        ${palette.secondary.dark} 100%
      );`,
      }}
    >
      <Card
        sx={{
          minWidth: 300,
          marginTop: "5em",
        }}
      >
        <Box
          component="div"
          sx={{
            margin: "1em",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logoUri} width={200} />
        </Box>
        {login}
      </Card>
      <Box
        component="div"
        sx={{
          ...(bgImage
            ? { backgroundColor: alpha(palette.background.default, 0.8) }
            : { padding: 0.5 }),
        }}
      >
        {help}
      </Box>
    </Box>
  );
}
