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
  TooltipProps,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTranslation } from "react-i18next";
import { ActionButton, Dialog } from "../..";
import ColumnsOverview from "./ColumnsOverview";
import RenderIfVisible from "react-render-if-visible";

export interface ColumnsSelectorProps {
  columnsSequence: string[];
  setSequence: React.Dispatch<React.SetStateAction<string[]>>;
  selected: string[];
  setSelected: (cols: string[]) => void;
  resetSequence?: () => void;
}

export default function ColumnSelector({
  columnsSequence = [],
  setSequence,
  selected = [],
  setSelected,
  resetSequence,
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

  const beforeClose = useCallback(() => {
    setTimeout(() => setFilter(""), 200);
    closeColSelector();
  }, [setFilter, closeColSelector]);

  const columns = [...columnsSequence].sort().map((cs) => ({
    name: cs,
    label: t(cs.replaceAll(".", "_") as "_"),
  }));

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  return (
    <>
      <div>
        <Tooltip title={t("manage_columns")} disableInteractive>
          <IconButton id="kzzdjq" onClick={showColSelector}>
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Dialog
        {...{
          open, // No 'if' needed because of this property
          onClose: beforeClose,
          title: t("manage_columns"),
        }}
      >
        <Dialog
          {...{
            open: resetDialogOpen,
            title: t("datatable_reset_columns_title"),
            onBackdropClick: () => setResetDialogOpen(false),
          }}
        >
          <DialogContent>{t("datatable_reset_columns_body")}</DialogContent>
          <DialogActions>
            <ActionButton
              variant="outlined"
              onClick={() => setResetDialogOpen(false)}
            >
              {t("cancel")}
            </ActionButton>
            <ActionButton
              onClick={() => {
                if (resetSequence) {
                  resetSequence();
                  setResetDialogOpen(false);
                  beforeClose();
                }
              }}
            >
              {t("reset")}
            </ActionButton>
          </DialogActions>
        </Dialog>
        {columnsSequence.length > 10 && (
          <DialogActions sx={{ justifyContent: "flex-start" }}>
            <TextField
              {...{
                id: "lslzqj",
                size: "small",
                onChange: onFilterChange,
                placeholder: t("input_placeholder_filter", "filter ..."),
                sx: {
                  width: "100%",
                },
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
              .map(({ name, label }) => {
                const title = (
                  <>
                    {t("move_column")}
                    {
                      <ColumnsOverview
                        {...{
                          columnsSequence,
                          currentCol: name,
                          setSequence,
                        }}
                      ></ColumnsOverview>
                    }
                  </>
                );
                const tooltipProps: Omit<TooltipProps, "children"> = {
                  placement: "top",
                  title: title,
                  enterTouchDelay: 5,
                  leaveTouchDelay: columnsSequence.length < 50 ? 3500 : 5000,
                  arrow: true,
                };

                const cols = (
                  <FormGroup
                    row
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
                      <Tooltip {...tooltipProps}>
                        <IconButton id="ozkis" name={name} onClick={stepLeft}>
                          <ArrowLeftIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip {...tooltipProps}>
                        <IconButton id="ptejd" name={name} onClick={stepRight}>
                          <ArrowRightIcon />
                        </IconButton>
                      </Tooltip>
                    </ButtonGroup>
                  </FormGroup>
                );

                return columnsSequence.length > 50 ? (
                  <RenderIfVisible key={name} defaultHeight={40}>
                    {cols}
                  </RenderIfVisible>
                ) : (
                  <div key={name}>{cols}</div>
                );
              })}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <ActionButton
            variant="outlined"
            onClick={() => setResetDialogOpen(true)}
          >
            {t("reset")}
          </ActionButton>
          <ActionButton onClick={beforeClose}>{t("close")}</ActionButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
