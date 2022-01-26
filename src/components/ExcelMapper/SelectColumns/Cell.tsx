import { styled } from "@mui/material";

interface CellProps {
  isHead: boolean;
  isSelected: boolean;
}
export const Cell = styled("div", {
  shouldForwardProp: (p) => p != "isSelected" && p != "isHead",
})<CellProps>(
  ({
    theme: {
      spacing,
      palette: { primary, text },
    },
    isHead,
    isSelected,
  }) => ({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 150,
    paddingRight: spacing(2),
    paddingLeft: spacing(1),
    borderColor: "text.disabled",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    height: "1.5em",
    color: isHead ? text.primary : text.secondary,
    ...(isSelected
      ? {
          backgroundColor: primary.main,
          color: primary.contrastText,
        }
      : {}),
  })
);
