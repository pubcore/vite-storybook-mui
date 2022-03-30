import { HelpOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FieldTemplateProps } from "@rjsf/core";
import { useState } from "react";
import Dialog from "../Dialog/Dialog";

// see https://react-jsonschema-form.readthedocs.io/en/v1.8.1/advanced-customization/#field-template
export function FieldTemplate(props: FieldTemplateProps) {
  const { id, label, description, children, errors, help } = props;

  const isRootField = id === "rjsf";

  console.log("Field template props:", props);

  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {isHelpDialogOpen ? (
        <Dialog
          {...{
            open: isHelpDialogOpen,
            title: "PDF Dialog",
            onClose: () => setIsHelpDialogOpen(false),
          }}
        >
          <div>Test</div>
        </Dialog>
      ) : null}
      {label && !isRootField ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              marginRight: 2,
            }}
          >
            <Typography>{label}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              marginRight: 2,
            }}
          >
            <IconButton onClick={() => setIsHelpDialogOpen(true)}>
              <HelpOutline />
            </IconButton>
          </Box>
        </Box>
      ) : null}
      <Box>
        {description}
        {children}
        {errors}
        {help}
      </Box>
    </Box>
  );
}
