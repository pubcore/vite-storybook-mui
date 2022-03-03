import { useCallback, useMemo, useState } from "react";
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
  Popover,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTranslation } from "react-i18next";
import { ActionButton, Dialog } from "../..";
import ColumnsOverview from "./ColumnsOverview";
import RenderIfVisible from "react-render-if-visible";
import { DatatableProps } from "../Datatable";
import { Commit } from "@mui/icons-material";
import { Box } from "@mui/system";

export interface ColumnsSelectorProps {
  columns: DatatableProps["columns"];
  columnsSequence: string[];
  setSequence: React.Dispatch<React.SetStateAction<string[]>>;
  selected: string[];
  setSelected: (cols: string[]) => void;
  resetSequence?: () => void;
}

export default function ColumnSelector({
  columns,
  columnsSequence,
  setSequence,
  selected,
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

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const labels: Map<string, string> = useMemo(
    () =>
      [...columnsSequence]
        .sort()
        .reduce(
          (acc, col) =>
            acc.set(
              col,
              String(
                columns?.find((c) => c.name === col)?.label ??
                  t(col.replaceAll(".", "_") as "_")
              )
            ),
          new Map<string, string>()
        ) ?? new Map<string, string>(),
    [columns, columnsSequence, t]
  );

  const [activePopover, setActivePopover] = useState("");

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

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
            width: { xs: 250, sm: 400, md: 500 },
            height: 400,
            paddingTop: 0,
          }}
        >
          <FormGroup>
            {columnsSequence
              .filter(
                (name) =>
                  !filter ||
                  labels.get(name)?.toLowerCase().includes(filter.toLowerCase())
              )
              .sort((a, b) =>
                String(labels.get(a)).localeCompare(
                  String(labels.get(b)),
                  undefined,
                  { numeric: true }
                )
              )
              .map((name) => {
                const label = labels.get(name) as string;

                const cols = (
                  <FormGroup
                    data-col-name={name}
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

                    <Popover
                      {...{
                        open: name === activePopover,
                        anchorEl: popoverAnchor,
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center",
                        },
                        transformOrigin: {
                          vertical: "bottom",
                          horizontal: "center",
                        },
                        onClose: () => {
                          setActivePopover("");
                          setPopoverAnchor(null);
                        },
                      }}
                    >
                      <Box sx={{ padding: 1 }}>
                        {t("datatable_move_column")}
                        <ColumnsOverview
                          {...{
                            columnsSequence,
                            currentCol: name,
                            setSequence,
                          }}
                        ></ColumnsOverview>
                      </Box>
                    </Popover>
                    <ButtonGroup size="medium">
                      <IconButton id="ozkis" name={name} onClick={stepLeft}>
                        <ArrowLeftIcon />
                      </IconButton>
                      <IconButton
                        id="algne"
                        name={name}
                        onClick={({ currentTarget }) => {
                          setActivePopover(name);
                          setPopoverAnchor(currentTarget.parentElement);
                        }}
                      >
                        <Commit />
                      </IconButton>
                      <IconButton id="ptejd" name={name} onClick={stepRight}>
                        <ArrowRightIcon />
                      </IconButton>
                    </ButtonGroup>
                  </FormGroup>
                );

                return columnsSequence.length > 25 ? (
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
