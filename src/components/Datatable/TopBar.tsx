import { Box, CircularProgress } from "@mui/material";
import { isValidElement, ReactNode } from "react";
import { useContext } from "react";
import ActionBar from "../ActionBar";
import { ContainerContext } from "./ContainerContext";
import { DatatableProps } from "./DatatableTypes";
import { useTranslation } from "react-i18next";

export function TopBar({ title: titleProp, isLoading, children }: TopBarProps) {
  const { t } = useTranslation();
  const { topBarHeight } = useContext(ContainerContext);
  const title =
    typeof titleProp == "string" ? (
      <>
        <h3>{titleProp}</h3> &nbsp;
      </>
    ) : (
      <>{isValidElement(titleProp) ? titleProp : <>&nbsp;</>}</>
    );
  return (
    <ActionBar
      sx={{ height: topBarHeight, position: "relative" }}
      elevation={1}
    >
      {isLoading ? (
        <>
          {title}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="secondary" />
          </div>
          &nbsp;
        </>
      ) : (
        <>
          {title}
          <Box display="flex" gap={1}>
            {children}
          </Box>
        </>
      )}
    </ActionBar>
  );
}

type TopBarProps = Pick<DatatableProps, "title"> & {
  isLoading: boolean;
  children: ReactNode;
};
