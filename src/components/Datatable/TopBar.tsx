import { Box, CircularProgress } from "@mui/material";
import { isValidElement, ReactNode, useMemo } from "react";
import { useContext } from "react";
import ActionBar from "../ActionBar";
import { ContainerContext } from "./ContainerContext";
import { DatatableProps } from "./DatatableTypes";
import { styled } from "@mui/system";

export function TopBar({ title: titleProp, isLoading, tools }: TopBarProps) {
  const { topBarHeight } = useContext(ContainerContext);
  const title = useMemo(
    () =>
      typeof titleProp == "string" ? (
        <>
          <h3>{titleProp}</h3> &nbsp;
        </>
      ) : (
        <>{isValidElement(titleProp) ? titleProp : <>&nbsp;</>}</>
      ),
    [titleProp]
  );

  const sx = useMemo(
    () => ({ height: topBarHeight, position: "relative" }),
    [topBarHeight]
  );

  return (
    <ActionBar sx={sx} elevation={1}>
      {isLoading ? (
        <>
          {title}
          <SpinnerContainer>
            <CircularProgress color="secondary" />
          </SpinnerContainer>
          &nbsp;
        </>
      ) : (
        <>
          {title}
          <Box display="flex" gap={1}>
            {tools}
          </Box>
        </>
      )}
    </ActionBar>
  );
}

type TopBarProps = Pick<DatatableProps, "title"> & {
  isLoading: boolean;
  tools: ReactNode;
};

const SpinnerContainer = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
