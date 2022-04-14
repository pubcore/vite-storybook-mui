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
import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomItemsSection, maxItemDisplayLength } from "./CustomItemsSection";

export function MultiSelectField({ onChange, schema }: FieldProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const [customItems, setCustomItems] = useState<string[]>([]);

  const predefItems: string[] = useMemo(
    () =>
      (schema?.properties?.predefined as { items?: { enum?: string[] } })?.items
        ?.enum ?? [],
    [schema]
  );

  const handleChange = useCallback(
    ({ target: { value } }: SelectChangeEvent<string[]>) => {
      // on autofill we get a stringified value
      const val = (typeof value === "string" ? value.split(",") : value).filter(
        (v) => v != undefined
      );

      setSelectedValues(val);
      // onChange(val);
    },
    []
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
    const itmAmt = selectedValues.length + customItems.length;
    return `${itmAmt} item${itmAmt !== 1 ? "s" : ""} selected`;
  }, [selectedValues, customItems]);

  useEffect(() => {
    onChange({
      predefined: predefItems.filter((itm) => selectedValues.includes(itm)),
      custom: customItems,
    });
  }, [onChange, selectedValues, predefItems, customItems]);

  return (
    <Box
      className="custom-widget multiselect-widget"
      sx={{ overflowY: "auto" }}
      title={[...selectedValues, ...customItems].sort().join(", ")}
    >
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={renderItems}
        // style={{ minWidth: 200 }}
        displayEmpty
        sx={{ minWidth: 240 }}
      >
        {predefItems.map((itm) => {
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
          {...{ items: customItems, setItems: setCustomItems }}
        />
      </Select>
    </Box>
  );
}
