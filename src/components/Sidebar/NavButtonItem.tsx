import { Button, ButtonProps, ListItemIcon, Typography } from "@mui/material";
import { Item } from "src/components/Sidebar/index";
import { useTranslation } from "react-i18next";

interface Props extends ButtonProps {
  item: Item;
  isOpen?: boolean;
  subItem?: boolean;
}

export function NavButtonItem({ item, isOpen, subItem, ...rest }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      {...rest}
      disabled={item.disabled}
      variant="text"
      color="inherit"
      sx={{
        py: 1,
        px: 2.25,
        display: "flex",
        justifyContent: "flex-start",
        textTransform: "initial",
      }}
      startIcon={
        <ListItemIcon
          sx={{
            minWidth: 5,
            mr: 1.25,
            ...(item.disabled && { color: "text.disabled" }),
          }}
        >
          {item.icon}
        </ListItemIcon>
      }
    >
      {(isOpen || subItem) && (
        <Typography color={item.disabled ? "text.disabled" : "text.secondary"}>
          {t(item.name as "_")}
        </Typography>
      )}
    </Button>
  );
}
