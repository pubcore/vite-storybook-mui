import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";

const maxLength = 64;

interface CustomItemProps {
  value: string;
  title: string;
  items: string[];
  setItems: (_: string[]) => void;
}

export function CustomItem({ value, title, items, setItems }: CustomItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const deleteItem = useCallback(() => {
    if (!items.includes(value)) return;

    const newItems = [...items];
    newItems.splice(items.indexOf(value), 1);
    setItems(newItems);
  }, [items, setItems, value]);

  const [editVal, setEditVal] = useState("");

  const editItem = useCallback(() => {
    if (items.indexOf(editVal) > -1) return;
    if (editVal.length < 1) {
      setEditVal("");
      setIsEditing(false);
      return;
    }

    const newItems = [...items];
    newItems[newItems.indexOf(value)] = editVal;
    setItems(newItems);

    setEditVal("");
    setIsEditing(false);
  }, [editVal, items, setItems, value]);

  return (
    <Box
      {...{ title }}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        height: 50,
      }}
    >
      {!isEditing ? (
        <>
          <Checkbox checked={true} sx={{ pointerEvents: "none" }} disabled />
          <ListItemText primary={value} />
          <Box sx={{ paddingLeft: 2, whiteSpace: "nowrap" }}>
            <IconButton
              sx={{ marginRight: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                deleteItem();
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <TextField
            {...{
              variant: "outlined",
              size: "small",
              autoFocus: true,
              defaultValue: value,
              fullWidth: true,
              style: { margin: 10 },
              inputProps: {
                maxLength,
              },
              onChange: ({ currentTarget }) => setEditVal(currentTarget.value),
              onKeyDown: (e) => {
                e.stopPropagation();
                if (e.key === "Escape") {
                  setEditVal("");
                  setIsEditing(false);
                }
                if (e.key === "Enter") editItem();
              },
            }}
          />
          <Box sx={{ whiteSpace: "nowrap" }}>
            <IconButton sx={{ marginRight: 1 }} onClick={editItem}>
              <Save />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsEditing(false);
                setEditVal("");
              }}
            >
              <Cancel />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
}
