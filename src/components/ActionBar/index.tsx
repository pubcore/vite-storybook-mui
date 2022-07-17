import { Toolbar, AppBar, AppBarProps } from "@mui/material";

export type ActionBarProps = AppBarProps;

export default function ActionBar({
  children,
  elevation = 0,
  ...rest
}: ActionBarProps) {
  return (
    <AppBar position="static" color="transparent" {...{ elevation, ...rest }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>{children}</Toolbar>
    </AppBar>
  );
}
