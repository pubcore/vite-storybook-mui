import {
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useCallback, useMemo, useRef, useState } from "react";
import { CustomItemsSection, maxItemDisplayLength } from "./CustomItemsSection";

export function MultiSelectField({ onChange, idSchema, ...rest }: FieldProps) {
  console.log("CustomMultiSelect props:", rest);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  console.info("selecteditms", selectedValues);

  const customValues: string[] = [];

  const items = useMemo(
    () => [
      "ISO-XY01",
      "ISO-XY02",
      "ISO-XY03",
      "ISO-XY04",
      "ISO-XY05",
      "ISO-ABCDEFGHIJKLMNOPQRSTUVWXYZ-01",
    ],
    []
  );

  const handleChange = useCallback(
    ({ target: { value } }: SelectChangeEvent<string[]>) => {
      // on autofill we get a stringified value
      const val = (typeof value === "string" ? value.split(",") : value).filter(
        (v) => v != undefined
      );

      setSelectedValues(val);
      onChange(val);
    },
    [onChange]
  );

  const renderItems = useCallback(() => {
    // let res = selectedValues.join(", ");
    // if (res.length > 32) {
    //   res = res.substring(0, 32).trim();
    //   if (res.endsWith(",")) res = res.substring(0, res.length - 1);
    //   return `${res}...`;
    // }
    // return res;

    // return t("items_selected", { count: selectedValues.length });
    return `${selectedValues.length} item${
      selectedValues.length !== 1 ? "s" : ""
    } selected`;
  }, [selectedValues]);

  // const [addCustomOpen, setAddCustomOpen] = useState(false);
  // const [currentCustomVal, setCurrentCustomVal] = useState("");
  // const [isEditingCustomVal, setIsEditingCustomVal] = useState<string | null>(
  //   null
  // );

  // const addCustomClicked = useCallback(() => {
  //   setAddCustomOpen(true);
  // }, [setAddCustomOpen]);

  // const addCustomVal = useCallback(() => {
  //   if (
  //     !currentCustomVal ||
  //     customValues.includes(currentCustomVal) ||
  //     items.includes(currentCustomVal) ||
  //     currentCustomVal.length < 1
  //   )
  //     return;

  //   setCurrentCustomVal("");
  //   setAddCustomOpen(false);

  //   setCustomValues([...customValues, currentCustomVal]);
  //   setSelectedValues([...selectedValues, currentCustomVal]);
  // }, [
  //   items,
  //   customValues,
  //   setCustomValues,
  //   setSelectedValues,
  //   selectedValues,
  //   currentCustomVal,
  // ]);

  // const editCustomValue = useCallback(
  //   (
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //     value: string,
  //     newVal: string
  //   ) => {
  //     e.stopPropagation();
  //     console.log(`Edit custom value '${value}', new val '${newVal}'`);
  //   },
  //   []
  // );

  // const deleteCustomValue = useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
  //     console.log(`Delete custom value '${value}'`);
  //     e.stopPropagation();

  //     const newCustomVals = [...customValues];
  //     newCustomVals.splice(customValues.indexOf(value), 1);
  //     setCustomValues(newCustomVals);

  //     const newSelectedVals = [...selectedValues];
  //     newSelectedVals.splice(selectedValues.indexOf(value), 1);
  //     setSelectedValues(newSelectedVals);
  //   },
  //   [customValues, selectedValues]
  // );

  const hiddenInput = useRef<HTMLInputElement>(null);

  return (
    <Box className="custom-widget multiselect-widget">
      <input type="hidden" id={idSchema.custom.$id} ref={hiddenInput} />
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        // onClose={() => {
        //   setCurrentCustomVal("");
        //   setAddCustomOpen(false);
        // }}
        inputProps={{
          id: idSchema.predefined.$id,
        }}
        input={<OutlinedInput />}
        renderValue={renderItems}
        title={selectedValues.join(", ")}
        // style={{ minWidth: 200 }}
        displayEmpty
      >
        {items.map((itm) => {
          const itmTrimmed =
            itm.length > maxItemDisplayLength
              ? itm.substring(0, maxItemDisplayLength - 3) + "..."
              : itm;
          return (
            <MenuItem
              key={itm}
              title={itm}
              value={itm}
              sx={{ paddingRight: 5 }}
            >
              <Checkbox checked={selectedValues.indexOf(itm) > -1} />
              <ListItemText>{itmTrimmed}</ListItemText>
            </MenuItem>
          );
        })}
        <CustomItemsSection
          {...{ items: customValues, inputRef: hiddenInput }}
        ></CustomItemsSection>
      </Select>
    </Box>
  );
}
