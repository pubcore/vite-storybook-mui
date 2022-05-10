import type { FieldTemplateProps } from "@rjsf/core";
import {
  FormControl,
  FormHelperText,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";

export function FieldTemplate({
  id,
  children,
  displayLabel,
  hidden,
  required,
  rawErrors = [],
  rawHelp,
  rawDescription,
  ...props
}: FieldTemplateProps) {
  return hidden ? (
    <></>
  ) : ["string", "number", "boolean"].includes(String(props.schema.type)) ? (
    <>
      {displayLabel && rawDescription ? (
        <Typography variant="caption" color="textSecondary">
          {rawDescription}
        </Typography>
      ) : null}
      <FormControl
        fullWidth={true}
        error={rawErrors.length ? true : false}
        required={required}
      >
        {children}
        {rawErrors.length > 0 && (
          <List sx={{ marginTop: -1 }} dense={true} disablePadding={true}>
            {rawErrors.map((error, i: number) => {
              return (
                <ListItem key={i} disableGutters={true}>
                  <FormHelperText id={id}>{error}</FormHelperText>
                </ListItem>
              );
            })}
          </List>
        )}
        {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
      </FormControl>
    </>
  ) : String(props.schema.type) === "array" &&
    //count underscore in id string to detect nesting level ...
    (id.match(/_/g) || []).length > 1 ? (
    <Paper elevation={1}>{children}</Paper>
  ) : (
    <>{children}</>
  );
}
