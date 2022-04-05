import { Toolbar, AppBar, AppBarProps } from "@mui/material";

export type ActionBarProps = AppBarProps;

export default function ActionBar({ children, elevation = 0 }: ActionBarProps) {
  return (
    <AppBar position="static" color="transparent" {...{ elevation }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>{children}</Toolbar>
    </AppBar>
  );
}
