import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FieldProps } from "@rjsf/core";
import { useCallback, useMemo } from "react";
import { CustomItemsSection } from "./CustomItemsSection";

type FormData = {
  predefined: string[];
  custom: string[];
};

export function MultiSelectField(props: FieldProps) {
  const { onChange, schema, formData, required } = props;
  const { predefined = [], custom = [] }: FormData = formData;
  // @ts-ignore
  if (!Array.isArray(schema?.properties?.predefined?.items?.enum)) {
    throw TypeError("predefined.items.enum is not an array");
  }
  // @ts-ignore
  const predefItems = schema?.properties?.predefined?.items?.enum as string[];

  const handleChange = useCallback(
    ({ target: { value } }: SelectChangeEvent<string[]>) => {
      onChange({
        predefined: value,
        custom,
      });
    },
    [custom, onChange]
  );

  const setCustomItems = useCallback(
    (items) => {
      onChange({ predefined, custom: items });
    },
    [onChange, predefined]
  );

  const renderItems = useCallback(() => {
    return predefined.concat(custom).join(", ");
  }, [predefined, custom]);

  return (
    <Select
      multiple
      value={predefined.concat(custom)}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={renderItems}
      displayEmpty
      fullWidth={true}
      required={
        required ? !Boolean(predefined.length > 0 || custom.length) : false
      }
      autoComplete="off"
    >
      {predefItems.map((itm) => {
        return (
          <MenuItem
            key={String(itm)}
            title={itm}
            value={itm}
            sx={{ paddingRight: 5 }}
          >
            <Checkbox checked={predefined.indexOf(itm) > -1} />
            <ListItemText>{itm}</ListItemText>
          </MenuItem>
        );
      })}
      <CustomItemsSection {...{ items: custom, setItems: setCustomItems }} />
    </Select>
  );
}
