import { Slider } from "@mui/material";
import { Box } from "@mui/system";
import { debounce } from "lodash-es";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface ColumnsOverviewProps {
  columnsSequence: string[];
  currentCol?: string;
  setSequence?: (newSequence: string[]) => void;
}

/** Moves an item in `array`, `from` one index `to` another (returns the array, doesn't mutate) */
const moveInArray = <T,>(array: T[], from: number, to: number): T[] => {
  const arr = [...array];
  let numberOfDeletedElm = 1;
  const elm = arr.splice(from, numberOfDeletedElm)[0];
  numberOfDeletedElm = 0;
  arr.splice(to, numberOfDeletedElm, elm);
  return arr;
};

export default function ColumnsOverview({
  columnsSequence,
  currentCol,
  setSequence,
}: ColumnsOverviewProps) {
  const { t } = useTranslation();

  const sliderMoved = useCallback(
    (newIdx: number, oldIdx: number) =>
      setSequence && setSequence(moveInArray(columnsSequence, oldIdx, newIdx)),
    [setSequence, columnsSequence]
  );

  const value = currentCol ? columnsSequence.indexOf(currentCol) : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 0.5,
        paddingBottom: 0,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <Slider
        {...{
          min: 0,
          max: columnsSequence.length - 1,
          value,
          size: "medium",
          marks: columnsSequence.length < 30,
          track: false,
          onChange: (_e, val) =>
            debounce(() => sliderMoved(val as number, value ?? 0), 10, {
              leading: true,
              trailing: false,
            })(),
          title: t("datatable_columns_slider_title"),
          style: {
            width: columnsSequence.length < 30 ? 150 : 600,
          },
        }}
      ></Slider>
    </Box>
  );
}
