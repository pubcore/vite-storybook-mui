import { Toolbar, AppBar } from "@mui/material";
import { ReactNode } from "react";

export interface ActionBarProps {
  elevation?: number;
  children: ReactNode;
}

export default function ActionBar({ children, elevation = 0 }: ActionBarProps) {
  return (
    <AppBar position="static" color="transparent" {...{ elevation }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>{children}</Toolbar>
    </AppBar>
  );
}
