import { HelpOutline } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { A, ActionButton, JSONSchema7 } from "..";

export function ObjectFieldTemplate({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
  schema,
}: ObjectFieldTemplateProps) {
  const { breakpoints } = useTheme();
  const isMobile = !useMediaQuery(breakpoints.up("sm"));
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  let headers = [];
  if (uiSchema["ui:title"] || title) {
    headers.push(
      <TitleField
        id={`${idSchema.$id}-title`}
        title={title}
        required={required}
        key={`${idSchema.$id}-title-${title}`}
      />
    );
  }
  if (description) {
    headers.push(
      <DescriptionField
        id={`${idSchema.$id}-description`}
        description={description}
        key={`${idSchema.$id}-description-${description}`}
      />
    );
  }
  const elements = properties.map((element) => element.content);
  const nameProperty = properties.find((prop) => prop.name === "name");
  const helpUri = nameProperty
    ? (schema?.properties?.[nameProperty.name] as JSONSchema7).description
    : null;

  return headers.length ? (
    <>
      <Grid container>
        <Grid item xs={11} sm={5}>
          {headers}
        </Grid>
        <Grid item xs={1} sx={{ textAlign: "center" }}>
          {helpUri ? (
            isMobile ? (
              <A href={helpUri}>
                <HelpOutline />
              </A>
            ) : (
              <IconButton onClick={() => setIsHelpDialogOpen(true)}>
                <HelpOutline />
              </IconButton>
            )
          ) : null}
        </Grid>
        <Grid item xs={12} sm={6}>
          {elements}
        </Grid>
      </Grid>
      {isHelpDialogOpen && helpUri && (
        <HelpDialog
          close={() => {
            setIsHelpDialogOpen(false);
          }}
          pdfUri={helpUri}
        />
      )}
    </>
  ) : (
    <>{elements}</>
  );
}

type HelpDialogProps = {
  close: () => void;
  pdfUri: string;
};

function HelpDialog({ close, pdfUri }: HelpDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      {...{
        open: true,
        onClose: () => close(),
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
        <ActionButton onClick={() => close()}>{t("close")}</ActionButton>
      </DialogActions>
    </Dialog>
  );
}
