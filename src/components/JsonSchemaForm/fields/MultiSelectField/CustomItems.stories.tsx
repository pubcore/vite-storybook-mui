import { Box } from "@mui/material";
import { useRef, useState } from "react";
import { CustomItemsSection } from "./CustomItemsSection";

export default {
  title: "JSON Schema Form/Custom Items",
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
