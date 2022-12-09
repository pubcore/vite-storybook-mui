import { Slider } from "@mui/material";
import { Box } from "@mui/system";
import { debounce } from "lodash-es";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ColumnsOverviewProps {
  columnsSequence: string[];
  currentCol: string;
  setSequence: React.Dispatch<React.SetStateAction<string[]>>;
}

/** Moves an item in `array`, `from` one index `to` another (returns the array, doesn't mutate) */
const moveInArray = <T,>(array: T[], from: number, to: number): T[] => {
  const arr = [...array];
  const elm = arr.splice(from, 1)[0];
  if (elm === undefined) {
    return array;
  }
  arr.splice(to, 0, elm);
  return arr;
};

export default function ColumnsOverview({
  columnsSequence,
  currentCol,
  setSequence,
}: ColumnsOverviewProps) {
  const { t } = useTranslation();

  const currentColIdx = columnsSequence.indexOf(currentCol);

  const handleSliderMoved = useMemo(
    () =>
      debounce((_, val) => {
        setSequence &&
          setSequence((oldSequence: string[]) =>
            moveInArray(oldSequence, oldSequence.indexOf(currentCol), val)
          );
      }, 150),
    [setSequence, currentCol]
  );

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
          key: currentColIdx,
          min: 0,
          max: columnsSequence.length - 1,
          defaultValue: currentColIdx,
          onChange: handleSliderMoved,
          size: "medium",
          marks: columnsSequence.length < 30,
          track: false,
          title: t("datatable_columns_slider_title"),
          sx: {
            width:
              columnsSequence.length < 30 ? 150 : { sm: 250, md: 300, xl: 400 },
          },
          componentsProps: {
            thumb: {
              style: {
                borderRadius: 4,
              },
            },
          },
        }}
      ></Slider>
    </Box>
  );
}
