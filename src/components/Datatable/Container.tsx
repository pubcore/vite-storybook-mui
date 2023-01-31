import { Paper, useTheme } from "@mui/material";
import { useMemo } from "react";
import { ContainerContext, initial } from "./ContainerContext";
import { DatatableProps } from "./DatatableTypes";
import { Main } from "./Main";
import { useResizeDetector } from "react-resize-detector";

export function Container({
  pageSize: pageSizeProp,
  headerHeight,
  minPageSize,
  rowHeight,
  ...rest
}: ContainerProps) {
  const { spacing } = useTheme();
  const { height: containerHeight = 0, ref } = useResizeDetector({
    refreshMode: "throttle",
    handleWidth: false,
  });

  const pageSize = useMemo(() => {
    return (
      pageSizeProp ??
      Math.max(
        Math.round(
          (containerHeight -
            initial.topBarHeight -
            2 * headerHeight -
            parseInt(spacing(1)) - //margin of HeaderRow
            initial.bottomBarHeight) /
            Math.max(rowHeight, 1)
        ),
        minPageSize
      )
    );
  }, [
    containerHeight,
    headerHeight,
    minPageSize,
    pageSizeProp,
    rowHeight,
    spacing,
  ]);

  return (
    <Paper
      ref={ref}
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
        //very important to avoid "resize" loop caused by useResizeDetector hook
        overflow: "hidden",
        scrollY: "auto",
      }}
    >
      <ContainerContext.Provider value={{ ...initial, pageSize }}>
        {containerHeight >= 0 ? <Main {...{ ...rest, rowHeight }} /> : null}
      </ContainerContext.Provider>
    </Paper>
  );
}

type ContainerProps = Required<
  Pick<DatatableProps, "headerHeight" | "minPageSize" | "rowHeight">
> &
  Omit<DatatableProps, "headerHeight" | "minPageSize" | "rowHeight">;
