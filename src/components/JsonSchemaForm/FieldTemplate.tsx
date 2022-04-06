import { HelpOutline } from "@mui/icons-material";
import {
  Box,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FieldTemplateProps } from "@rjsf/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../Button";
import { Dialog } from "../Dialog/Dialog";
import { A } from "../Link";

// see https://react-jsonschema-form.readthedocs.io/en/v1.8.1/advanced-customization/#field-template
export function FieldTemplate(props: FieldTemplateProps) {
  const { t } = useTranslation();

  const { label, description, children, errors, uiSchema } = props;

  const uiField = uiSchema?.["ui:field"];
  const pdfUri = uiSchema?.["ui:options"]?.helpUri;

  console.log(`Props for field template '${uiField}':`, props);

  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  const { breakpoints } = useTheme();

  const isMobile = !useMediaQuery(breakpoints.up("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {typeof pdfUri === "string" && isHelpDialogOpen ? (
        <Dialog
          {...{
            open: isHelpDialogOpen,
            onClose: () => setIsHelpDialogOpen(false),
            fullWidth: true,
            PaperProps: {
              sx: {
                maxWidth: 800,
              },
            },
          }}
        >
          <DialogContent
            sx={{
              height: {
                sm: 450,
                md: 600,
              },
              overflow: "hidden",
            }}
          >
            <object
              data={pdfUri}
              type="application/pdf"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <p>
                <A href={pdfUri} target="_blank">
                  {t("open_help_document")}
                </A>
              </p>
            </object>
          </DialogContent>
          <DialogActions>
            <ActionButton
              variant="contained"
              onClick={() => setIsHelpDialogOpen(false)}
            >
              {t("close")}
            </ActionButton>
          </DialogActions>
        </Dialog>
      ) : null}
      {label && uiField ? (
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
          {typeof pdfUri === "string" ? (
            !isMobile ? (
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
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  marginRight: 2,
                }}
              >
                <A href={pdfUri}>
                  <HelpOutline />
                </A>
              </Box>
            )
          ) : null}
        </Box>
      ) : null}
      <Box>
        {description}
        {children}
        {errors}
      </Box>
    </Box>
  );
}
