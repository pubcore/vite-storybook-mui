import { HelpOutline } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { ObjectFieldTemplateProps, UiSchema } from "@rjsf/core";
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

  const uiOpts: UiSchema = uiSchema?.["ui:options"] ?? {};
  const fieldStyle = uiOpts?.fieldStyle ?? "horizontal";
  const paperElevation = uiOpts?.paperElevation as number | undefined;

  let headers = [];
  if (uiSchema["ui:title"] || title) {
    headers.push(
      <TitleField
        id={`${idSchema.$id}-title`}
        title={title}
        required={required}
        key={title}
      />
    );
  }
  if (description) {
    headers.push(
      <Box sx={{ marginBottom: fieldStyle === "vertical" ? 2 : 0 }}>
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
          key={description}
        />
      </Box>
    );
  }
  const elements = properties.map((element) => element.content);
  const nameProperty = properties.find((prop) => prop.name === "name");
  const helpUri = nameProperty
    ? (schema?.properties?.[nameProperty.name] as JSONSchema7).description
    : null;

  const helpButton = (
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
  );

  const content = (
    <Grid
      container
      className={`objectfieldtemplate-${fieldStyle}`}
      sx={{
        whiteSpace: fieldStyle === "vertical" ? "initial" : "nowrap",
      }}
      direction={fieldStyle === "vertical" ? "column" : "row"}
    >
      <Grid
        container
        direction="row"
        sx={{ flexWrap: fieldStyle === "vertical" ? "wrap" : "nowrap" }}
      >
        <Grid
          item
          xs={fieldStyle === "vertical" ? 11 : 5}
          sm={fieldStyle === "vertical" ? 11 : 5}
          sx={{ whiteSpace: "normal" }}
        >
          {headers}
        </Grid>
        {helpButton}
        <Grid
          item
          xs={fieldStyle === "vertical" ? 12 : 6}
          sm={fieldStyle === "vertical" ? 12 : 6}
        >
          {elements}
        </Grid>
      </Grid>
    </Grid>
  );
  {
    isHelpDialogOpen && helpUri && (
      <HelpDialog
        close={() => {
          setIsHelpDialogOpen(false);
        }}
        pdfUri={helpUri}
      />
    );
  }

  return headers.length ? (
    paperElevation ? (
      <Paper elevation={paperElevation} sx={{ padding: 3 }}>
        {content}
      </Paper>
    ) : (
      <>{content}</>
    )
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
        <ActionButton variant="contained" onClick={() => close()}>
          {t("close")}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}
