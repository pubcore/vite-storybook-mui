import SvgIcon from "@mui/material/SvgIcon";
import { Box } from "@mui/material";

export interface TextIconProps {
  muiColor: Record<number, string>;
  Icon: typeof SvgIcon;
  text: string | number;
}

export default function TextIcon({ muiColor, Icon, text }: TextIconProps) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
      }}
    >
      <Icon
        fontSize="small"
        sx={{
          color: muiColor[500],
          marginRight: 0.5,
        }}
      />
      {text}
    </Box>
  );
}
