import { Cancel, DeleteForever, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";

interface CustomItemProps {
  value: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export function CustomItem({ value, items, setItems }: CustomItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const deleteItem = useCallback(() => {
    if (!items.includes(value)) return;
    console.log("Deleting custom value", value);

    const newItems = [...items];
    newItems.splice(items.indexOf(value), 1);
    setItems(newItems);
  }, [items, setItems, value]);

  const [editVal, setEditVal] = useState("");

  const editItem = useCallback(() => {
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
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
      }}
    >
      {!isEditing ? (
        <>
          <Checkbox checked={true} />
          <ListItemText primary={value} />
          <Box sx={{ paddingLeft: 2 }}>
            <IconButton
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
              <DeleteForever />
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
              onChange: ({ currentTarget }) => setEditVal(currentTarget.value),
              onKeyDown: (e) => {
                e.stopPropagation();
                if (e.key === "Escape") {
                  setEditVal("");
                  setIsEditing(false);
                }
                if (e.key === "Enter") {
                  editItem();
                  setIsEditing(false);
                }
              },
            }}
          ></TextField>
          <Box sx={{ whiteSpace: "nowrap" }}>
            <IconButton onClick={() => editItem()}>
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
