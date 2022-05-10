import { Add, Cancel, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  ListSubheader,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomItem } from "./CustomItem";

export const maxItemDisplayLength = 32;

interface CustomItemsProps {
  items: string[];
  setItems: (_: string[]) => void;
}

export function CustomItemsSection({ items, setItems }: CustomItemsProps) {
  const { t } = useTranslation();

  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [currentVal, setCurrentVal] = useState("");

  const addCustomVal = () => {
    if (currentVal.length < 1 || items.includes(currentVal)) return;

    setItems([...items, currentVal]);

    setCurrentVal("");
    setIsAddCustomOpen(false);
  };

  const cancelAddNew = () => {
    setCurrentVal("");
    setIsAddCustomOpen(false);
  };

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
          paddingLeft: 1.8,
          paddingRight: 1.8,
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        {isAddCustomOpen ? (
          <>
            <TextField
              {...{
                variant: "outlined",
                size: "small",
                placeholder: t("enter_value"),
                style: { margin: 10, marginRight: 10 },
                autoFocus: true,
                fullWidth: true,
                inputProps: {
                  maxLength: 64,
                },
                onChange: ({ currentTarget }) =>
                  setCurrentVal(currentTarget.value),
                onKeyDown: (e) => {
                  e.stopPropagation();
                  e.key === "Enter" && addCustomVal();
                  e.key === "Escape" && cancelAddNew();
                },
              }}
            ></TextField>
            <IconButton sx={{ marginRight: 1 }} onClick={addCustomVal}>
              <Send />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsAddCustomOpen(false);
                setCurrentVal("");
              }}
            >
              <Cancel />
            </IconButton>
          </>
        ) : (
          <Button
            {...{
              variant: "outlined",
              onClick: () => setIsAddCustomOpen(true),
              startIcon: <Add />,
              style: {
                width: "100%",
                marginLeft: 10,
                marginRight: 10,
              },
            }}
          >
            {t("add_custom_value")}
          </Button>
        )}
      </Box>
      {[...items].sort().map((customItm) => {
        const itmTrimmed =
          customItm.length > maxItemDisplayLength
            ? customItm.substring(0, maxItemDisplayLength - 3) + "..."
            : customItm;
        return (
          <Box
            key={customItm}
            style={{
              marginLeft: 13,
              marginRight: 13,
            }}
          >
            <CustomItem
              {...{
                value: itmTrimmed,
                title: customItm,
                items,
                setItems,
              }}
            />
          </Box>
        );
      })}
    </>
  );
}
