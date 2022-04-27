import { HelpOutline } from "@mui/icons-material";
import {
  Box,
  DialogActions,
  DialogContent,
  IconButton,
  SxProps,
  Theme,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FieldTemplateProps } from "@rjsf/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createTheme } from "../../theme";
import { ActionButton } from "../Button";
import { Dialog } from "../Dialog/Dialog";
import { A } from "../Link";

// see https://react-jsonschema-form.readthedocs.io/en/v1.8.1/advanced-customization/#field-template
export function FieldTemplate(props: FieldTemplateProps) {
  const { t } = useTranslation();

  const { label, children, uiSchema, rawErrors } = props;

  const uiField = uiSchema?.["ui:field"];
  const pdfUri = uiSchema?.["ui:options"]?.helpUri;

  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  const theme = createTheme({
    darkMode: useMediaQuery("(prefers-color-scheme: dark)"),
  });
  const { breakpoints } = theme;

  const isMobile = !useMediaQuery(breakpoints.up("sm"));

  const labelEnabled = uiField && !["CustomFooter"].includes(uiField as string);

  const fieldLabel =
    label && uiField && labelEnabled ? (
      <Box
        className="form-field-label"
        sx={{
          display: "flex",
          flexDirection: "row",
          marginRight: 2,
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
          {/* <Box sx={{ maxWidth: 500 }}> */}
          <span>{label}</span>
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
    ) : null;

  const containerSx: Partial<SxProps<Theme>> = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  };

  return (
    <Box
      className="form-field-container"
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
      {fieldLabel}
      <Box
        className="form-input-container"
        {...(uiField === "CustomFooter"
          ? {
              sx: {
                ...containerSx,
                width: "100%",
                marginBottom: 2,
                marginTop: 2,
              },
            }
          : { sx: containerSx })}
      >
        {/* {description} */}
        {children}
        {Array.isArray(rawErrors)
          ? rawErrors.map((err) => (
              <Typography key={err} color="error" className="form-error">
                {err}
              </Typography>
            ))
          : null}
      </Box>
    </Box>
  );
}
