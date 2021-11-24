import { Box } from "@mui/material";
import { ReactNode } from "react";

export interface TabPanelProps {
  tab: string;
  children: ReactNode;
}

export default function TabPanel({ tab, children }: TabPanelProps) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
      role="tabpanel"
      id={`tabpanel-${tab}`}
      aria-labelledby={`tab-${tab}`}
    >
      {children}
    </Box>
  );
}
