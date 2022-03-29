import { Box } from "@mui/material";
import { useState } from "react";
import { CustomItemsSection } from "./CustomItemsSection";

export default {
  title: "JSON Schema Form/Custom Items",
};

export const NoValues = () => {
  const [items, setItems] = useState<string[]>([]);

  return (
    <Box sx={{ margin: 2, width: 500 }}>
      <CustomItemsSection {...{ items, setItems }} />
    </Box>
  );
};

export const AlreadyHasValues = () => {
  const [items, setItems] = useState<string[]>(["foo", "bar"]);
  return (
    <Box sx={{ margin: 2, width: 500 }}>
      <CustomItemsSection {...{ items, setItems }} />
    </Box>
  );
};
