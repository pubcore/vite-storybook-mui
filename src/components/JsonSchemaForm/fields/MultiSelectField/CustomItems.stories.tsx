import { Box } from "@mui/material";
import { useRef, useState } from "react";
import { CustomItemsSection } from "./CustomItemsSection";
import { CustomItem as CustomItm } from "./CustomItem";

export default {
  title: "JSON Schema Form/Fields/MultiSelect Custom Items",
};

export const NoValues = () => {
  const [items, setItems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input type="hidden" ref={inputRef} />
      <Box sx={{ margin: 2, width: 500 }}>
        <CustomItemsSection {...{ items, setItems, inputRef }} />
      </Box>
    </>
  );
};

export const AlreadyHasValues = () => {
  const [items, setItems] = useState<string[]>(["foo", "bar"]);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input type="hidden" ref={inputRef} />
      <Box sx={{ margin: 2, width: 500 }}>
        <CustomItemsSection {...{ items, setItems, inputRef }} />
      </Box>
    </>
  );
};

export const _CustomItem = () => {
  const [items, setItems] = useState<string[]>(["value"]);
  const value = items[0];

  return (
    <Box sx={{ margin: 2, width: 500 }}>
      {value ? (
        <CustomItm
          {...{
            value,
            title: value,
            items,
            setItems,
          }}
        />
      ) : null}
    </Box>
  );
};
