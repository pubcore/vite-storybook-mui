import { ReactNode, useMemo } from "react";
import {
  CssBaseline,
  useMediaQuery,
  ThemeProvider,
  ThemeOptions,
  createTheme as muiCreateTheme,
  Theme,
} from "@mui/material";

import { BrowserRouter } from "react-router-dom";
const useDarkModeDefault = () => null;

export interface AppDecoratorProps {
  children: ReactNode;
  createTheme: ({ darkMode }: { darkMode: boolean }) => Theme;
  useDarkMode?: () => boolean | null;
}

export function AppDecorator({
  children,
  createTheme,
  useDarkMode = useDarkModeDefault,
}: AppDecoratorProps) {
  const darkModeBySwitch = useDarkMode();
  const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(() => {
    const outerTheme = createTheme({ darkMode: darkModeBySwitch ?? darkMode });
    //background color for input field, if browser suggested value is used
    const _bgColor = outerTheme.palette.background.default;
    return muiCreateTheme(outerTheme, {
      components: {
        MuiOutlinedInput: {
          styleOverrides: {
            input: {
              "&:-webkit-autofill": {
                "-webkit-box-shadow": `0 0 0 100px ${_bgColor} inset`,
                "-webkit-text-fill-color":
                  outerTheme.palette.getContrastText(_bgColor),
              },
            },
          },
        },
        MuiButton: {
          defaultProps: {
            size: "small",
            variant: "contained",
          },
        },
        MuiSelect: {
          defaultProps: {
            size: "small",
          },
        },
        MuiTabs: {
          defaultProps: {
            indicatorColor: "secondary",
            textColor: "secondary",
          },
        },
        MuiSvgIcon: {
          defaultProps: { fontSize: "small" },
        },
      },
    } as ThemeOptions);
  }, [createTheme, darkMode, darkModeBySwitch]);
  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
}
