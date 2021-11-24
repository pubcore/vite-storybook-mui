import { Paper, Box } from "@mui/material";
import { ReactNode, FormEventHandler } from "react";

export interface FormProps {
  onSubmit: FormEventHandler;
  children: ReactNode;
  width?: number;
}

export default function Form({ onSubmit, children, width }: FormProps) {
  return (
    <Paper elevation={2}>
      <Box
        component="form"
        {...{ onSubmit, width }}
        sx={{
          width,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 2,
          "> *": {
            margin: 1,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
