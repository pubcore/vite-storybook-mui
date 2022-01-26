import { Box } from "@mui/system";
import { TooltipOnOverflow } from "../";

export default {
  title: "Tooltip on overflow",
};

export const Default = () => (
  <>
    <Box sx={{ width: 100 }}>
      <TooltipOnOverflow>Only long texts will have a tooltip</TooltipOnOverflow>
    </Box>
    <Box sx={{ width: 100 }}>
      <TooltipOnOverflow>No tooltip</TooltipOnOverflow>
    </Box>
  </>
);
