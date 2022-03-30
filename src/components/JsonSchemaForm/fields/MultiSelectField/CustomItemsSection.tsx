import { Add, Cancel, DeleteForever, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  ListSubheader,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../../Button";
import Dialog from "../../../Dialog/Dialog";
import { CustomItem } from "./CustomItem";

export const maxItemDisplayLength = 32;

interface CustomItemsProps {
  items?: string[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export function CustomItemsSection({
  items: initialItems,
  inputRef,
}: CustomItemsProps) {
  const { t } = useTranslation();

  const [items, setItems] = useState(initialItems ?? []);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [currentVal, setCurrentVal] = useState("");

  if (inputRef.current) inputRef.current.value = items.join(",");

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

  const [deleteAllDialogOpen, setDialogDelAllCustomOpen] = useState(false);

  const deleteAllCustom = useCallback(() => {
    setItems([]);
    setDialogDelAllCustomOpen(false);
  }, []);

  const deleteAllCustomDialog = (
    <Dialog
      {...{
        title: "Delete all custom values?",
        open: deleteAllDialogOpen,
      }}
    >
      <DialogContent>
        Do you really want to delete all custom values?
      </DialogContent>
      <DialogActions>
        <ActionButton
          variant="outlined"
          onClick={() => setDialogDelAllCustomOpen(false)}
        >
          {t("cancel")}
        </ActionButton>
        <ActionButton variant="contained" onClick={deleteAllCustom}>
          {t("confirm_delete_all_custom")}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {deleteAllCustomDialog}
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
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
            style={{
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Button
              {...{
                variant: "contained",
                onClick: () => setIsAddCustomOpen(true),
                startIcon: <Add />,
              }}
            >
              {t("add_custom_value")}
            </Button>
            <Button
              {...{
                variant: "outlined",
                onClick: () => setDialogDelAllCustomOpen(true),
                startIcon: <DeleteForever />,
              }}
            >
              {t("delete_all_custom_values")}
            </Button>
          </Box>
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
