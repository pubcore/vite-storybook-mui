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
  //count underscore in id string to detect nesting level ...
  const nestingLevel = (id.match(/_/g) || []).length;
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
    nestingLevel > 1 &&
    nestingLevel < 4 ? (
    <Paper elevation={3} sx={{ padding: 3 }}>
      {children}
    </Paper>
  ) : (
    <>{children}</>
  );
}
