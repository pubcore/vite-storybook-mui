import { useCallback, useState } from "react";
import {
  IconButton,
  Tooltip,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  ButtonGroup,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTranslation } from "react-i18next";
import { ActionButton, Dialog } from "../..";

export interface ColumnsSelectorProps {
  columnsSequence: string[];
  setSequence: (cols: string[]) => void;
  selected: string[];
  setSelected: (cols: string[]) => void;
}

export default function ColumnSelector({
  columnsSequence = [],
  setSequence,
  selected = [],
  setSelected,
}: ColumnsSelectorProps) {
  const [open, setIsOpen] = useState(false);
  const closeColSelector = useCallback(() => setIsOpen(false), [setIsOpen]);
  const showColSelector = useCallback(() => setIsOpen(true), [setIsOpen]);
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
      const current = columnsSequence.indexOf(name);
      if (current >= columnsSequence.length - 1) {
        return columnsSequence;
      }
      const a = columnsSequence.slice();
      [a[current], a[current + 1]] = [a[current + 1], a[current]];
      setSequence(a);
    },
    [columnsSequence, setSequence]
  );
  const stepLeft = useCallback(
    ({ currentTarget: { name } }) => {
      const current = columnsSequence.indexOf(name);
      if (current <= 0) {
        return columnsSequence;
      }
      const a = columnsSequence.slice();
      [a[current], a[current - 1]] = [a[current - 1], a[current]];
      setSequence(a);
    },
    [columnsSequence, setSequence]
  );

  const columns = columnsSequence.sort().map((cs) => ({
    name: cs,
    label: t(cs.replaceAll(".", "_") as "_"),
  }));

  return (
    <>
      <div>
        <Tooltip title={t("manage_columns")}>
          <IconButton id="kzzdjq" onClick={showColSelector}>
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Dialog
        {...{
          open, // No 'if' needed because of this property
          onClose: closeColSelector,
          title: t("manage_columns"),
        }}
      >
        {columnsSequence.length > 10 && (
          <DialogActions sx={{ justifyContent: "flex-start" }}>
            <TextField
              {...{
                id: "lslzqj",
                size: "small",
                onChange: onFilterChange,
                placeholder: t("input_placeholder_filter", "filter ..."),
              }}
            />
          </DialogActions>
        )}
        <DialogContent
          sx={{
            width: { xs: 250, sm: 400 },
            height: 400,
            paddingTop: 0,
          }}
        >
          <FormGroup>
            {columns
              .filter(
                (col) =>
                  !filter ||
                  col.label.toLowerCase().includes(filter.toLowerCase())
              )
              .map(({ name, label }) => (
                <FormGroup
                  row
                  key={name}
                  style={{
                    justifyContent: "space-between",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        {...{
                          name,
                          onChange: switchColumn,
                          checked: selected.includes(name),
                        }}
                      />
                    }
                    {...{
                      id: `columns_selector_switch_${label.replaceAll(
                        ".",
                        "_"
                      )}`,
                      key: name,
                      label,
                    }}
                  />
                  <ButtonGroup size="small">
                    <Tooltip title={t("move_column_one_step_left")}>
                      <IconButton id="ozkis" name={name} onClick={stepLeft}>
                        <ArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("move_column_one_step_right")}>
                      <IconButton id="ptejd" name={name} onClick={stepRight}>
                        <ArrowRightIcon />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </FormGroup>
              ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <ActionButton onClick={closeColSelector}>{t("close")}</ActionButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
