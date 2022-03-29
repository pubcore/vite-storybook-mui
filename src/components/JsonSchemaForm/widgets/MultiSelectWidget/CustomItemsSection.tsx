import { Add, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  ListSubheader,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomItem } from "./CustomItem";

interface CustomItemProps {
  items?: string[];
}

export function CustomItemsSection({ items: initialItems }: CustomItemProps) {
  const { t } = useTranslation();

  const [items, setItems] = useState(initialItems ?? []);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [currentVal, setCurrentVal] = useState("");

  const addCustomVal = useCallback(() => {
    if (currentVal.length < 1 || items.includes(currentVal)) return;

    setItems([...items, currentVal]);

    setCurrentVal("");
    setIsAddCustomOpen(false);
  }, [items, currentVal]);

  const cancelAddNew = useCallback(() => {
    setCurrentVal("");
    setIsAddCustomOpen(false);
  }, []);

  return (
    <>
      <ListSubheader>{t("custom_values_header")}</ListSubheader>
      <Box
        sx={{
          display: "flex",
          direction: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          height: 50,
        }}
      >
        {isAddCustomOpen ? (
          <>
            <TextField
              {...{
                variant: "outlined",
                size: "small",
                placeholder: t("enter_value"),
                style: { margin: 10 },
                autoFocus: true,
                fullWidth: true,
                onChange: ({ currentTarget }) =>
                  setCurrentVal(currentTarget.value),
                onKeyDown: (e) => {
                  e.stopPropagation();
                  e.key === "Enter" && addCustomVal();
                  e.key === "Escape" && cancelAddNew();
                },
              }}
            ></TextField>
            <IconButton onClick={addCustomVal}>
              <Send />
            </IconButton>
          </>
        ) : (
          <Button
            {...{
              variant: "outlined",
              fullWidth: true,
              onClick: () => setIsAddCustomOpen(true),
              startIcon: <Add />,
            }}
          >
            {t("add_custom_value")}
          </Button>
        )}
      </Box>
      {[...items].sort().map((customItm) => (
        <CustomItem
          key={customItm}
          {...{
            value: customItm,
            items,
            setItems,
          }}
        />
      ))}
    </>
  );
}
