import {
  createTheme as muiCreateTheme,
  responsiveFontSizes,
} from "@mui/material";

export const createTheme = ({ darkMode }: { darkMode: boolean }) =>
  responsiveFontSizes(
    muiCreateTheme({
      typography: {
        fontFamily: "Helvetica, Arial, sans-serif",
      },
      palette: {
        ...(darkMode
          ? {
              mode: "dark",
              primary: { main: "#007705" },
              secondary: { main: "#5d99c6" },
              error: { main: "#ff4455" },
            }
          : {
              mode: "light",
              primary: { main: "#2e7d32" },
              secondary: { main: "#90caf9" },
              error: { main: "#ff1100" },
            }),
      },
      components: {
        MuiButton: {
          defaultProps: { variant: "contained" },
        },
      },
    })
  );
