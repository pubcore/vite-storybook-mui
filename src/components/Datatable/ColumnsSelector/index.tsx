import { useCallback, useState } from "react";
import {
  Popover,
  IconButton,
  Tooltip,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  ButtonGroup,
  Box,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTranslation } from "react-i18next";

export interface ColumnsSelectorProps {
  columns: string[];
  setSequence: (cols: string[]) => void;
  selected: string[];
  setSelected: (cols: string[]) => void;
}

export default function ColumnSelector({
  columns = [],
  setSequence,
  selected = [],
  setSelected,
}: ColumnsSelectorProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const onClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);
  const showPopover = useCallback(({ currentTarget }) => {
    setAnchorEl(currentTarget);
  }, []);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const switchColumn = useCallback(
    ({ currentTarget: { name } }, checked) =>
      setSelected(
        checked
          ? selected.includes(name)
            ? selected
            : selected.concat(name)
          : selected.filter((col) => col != name)
      ),
    [setSelected, selected]
  );
  const [filter, setFilter] = useState("");
  const onFilterChange = useCallback(
    ({ currentTarget: { value } }) => setFilter(value),
    []
  );
  const stepRight = useCallback(
    ({ currentTarget: { name } }) => {
      const current = columns.indexOf(name);
      if (current >= columns.length - 1) {
        return columns;
      }
      const a = columns.slice();
      [a[current], a[current + 1]] = [a[current + 1], a[current]];
      setSequence(a);
    },
    [columns, setSequence]
  );
  const stepLeft = useCallback(
    ({ currentTarget: { name } }) => {
      const current = columns.indexOf(name);
      if (current <= 0) {
        return columns;
      }
      const a = columns.slice();
      [a[current], a[current - 1]] = [a[current - 1], a[current]];
      setSequence(a);
    },
    [columns, setSequence]
  );
  return (
    <div>
      <Tooltip title={t("manage_columns")}>
        <IconButton id="kzzdjq" onClick={showPopover}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...{ open, onClose, anchorEl }}
      >
        <Box component="div" sx={{ margin: 2 }}>
          <h4>{t("manage_columns")}</h4>
          {columns.length > 10 && (
            <TextField
              {...{
                id: "lslzqj",
                size: "small",
                onChange: onFilterChange,
                placeholder: t("input_placeholder_filter", "filter ..."),
              }}
            />
          )}
          <FormGroup>
            {columns
              .filter((col) => !filter || col.includes(filter))
              .sort()
              .map((column) => (
                <FormGroup
                  row
                  key={column}
                  style={{ justifyContent: "space-between" }}
                >
                  <FormControlLabel
                    key={column}
                    control={
                      <Switch
                        {...{
                          name: column,
                          onChange: switchColumn,
                          checked: selected.includes(column),
                        }}
                      />
                    }
                    label={t(column.replaceAll(".", "_") as "_")}
                    id={
                      "columns_selector_switch_" + column.replaceAll(".", "_")
                    }
                  />
                  <ButtonGroup size="small">
                    <Tooltip title={t("move_column_one_step_left")}>
                      <IconButton id="ozkis" name={column} onClick={stepLeft}>
                        <ArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("move_column_one_step_right")}>
                      <IconButton id="ptejd" name={column} onClick={stepRight}>
                        <ArrowRightIcon />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </FormGroup>
              ))}
          </FormGroup>
        </Box>
      </Popover>
    </div>
  );
}
