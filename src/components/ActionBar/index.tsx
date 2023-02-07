import { Toolbar, AppBar, AppBarProps } from "@mui/material";

export type ActionBarProps = AppBarProps;

export default function ActionBar({
  children,
  elevation = 0,
  ...rest
}: ActionBarProps) {
  return (
    <AppBar position="static" color="transparent" {...{ elevation, ...rest }}>
      <Toolbar sx={sx}>{children}</Toolbar>
    </AppBar>
  );
}

const sx = { justifyContent: "space-between" };
