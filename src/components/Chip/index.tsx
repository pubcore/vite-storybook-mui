import { Chip as MuiChip, ChipProps, styled } from "@mui/material";

interface StyledChipProps extends ChipProps {
  severity: "warning" | "error" | "success" | "info";
}

const Chip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== "severity",
})<StyledChipProps>(({ severity, theme: { palette } }) => ({
  backgroundColor: palette[severity].main,
}));

export function Warning(props: ChipProps) {
  return <Chip size="small" severity="warning" {...props} />;
}

export function Error(props: ChipProps) {
  return <Chip size="small" severity="error" {...props} />;
}

export function Ok(props: ChipProps) {
  return <Chip size="small" severity="success" {...props} />;
}

export function Info(props: ChipProps) {
  return <Chip size="small" severity="info" {...props} />;
}
