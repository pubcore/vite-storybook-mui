import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FieldProps } from "@rjsf/core";

export function RadioField(props: FieldProps) {
  // const { onChange } = props;

  console.log("CustomRadio props:", props);

  return (
    <Box className="custom-widget radio-widget">
      <RadioGroup row>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        <FormControlLabel value="unknown" control={<Radio />} label="Unknown" />
      </RadioGroup>
    </Box>
  );
}
