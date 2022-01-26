import { Box, Button, ButtonGroup, Checkbox, Divider } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { InputText, TooltipOnOverflow } from "../../";
import { useTranslation } from "react-i18next";
import { utils } from "xlsx";
import { selectPages } from "../source/selectPages";
import { Cell } from "./Cell";
import { Source } from "../source";
import { selectColHeadsByPage } from "../source/selectColHeadsByPage";
import { debounce } from "lodash-es";

export interface SelectColumnsProps {
  source: Source;
  selectedColumns: boolean[][];
  toggleColumn: ({
    page,
    column,
    selected,
  }: {
    page: number;
    column: number;
    selected: boolean;
  }) => void;
  filterDefault?: string;
}

export default function SelectColumns({
  source,
  toggleColumn,
  selectedColumns,
  filterDefault = "",
}: SelectColumnsProps) {
  const pages = selectPages(source.workbook);
  const columnHeadsByPage = selectColHeadsByPage(source.workbook);
  const columnsByPageIndex = source.columnsByPageindex;
  const pageRefs = useRef({} as Record<string, HTMLElement | null>);
  const columnRefs = useRef({} as Record<string, HTMLElement | null>);
  const { t } = useTranslation();

  const [filterPredicate, setFilterPredicate] = useState<string>(filterDefault);

  const filter = useCallback(
    ({
      pageIndex,
      columnIndex,
    }: {
      pageIndex: number;
      columnIndex: number;
    }) => {
      return filterPredicate
        ? columnsByPageIndex[pageIndex][columnIndex].name
            .toLowerCase()
            .indexOf(filterPredicate.toLowerCase()) >= 0
        : true;
    },
    [columnsByPageIndex, filterPredicate]
  );
  const handleOnFilterChange = useMemo(
    () => debounce(({ target }) => setFilterPredicate(target.value), 500),
    []
  );

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          paddingTop: 1,
          width: 1,
          display: "flex",
        }}
      >
        <InputText
          name="columnFilterPredicate"
          defaultValue={filterPredicate}
          onChange={handleOnFilterChange}
          label="filter"
        />
      </Box>
      <Box
        sx={{
          width: 1,
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          overscrollBehaviorX: "contain", //avoid navigation event
          paddingBottom: 2,
        }}
      >
        {pages.map((page) => {
          const columnHeads = columnHeadsByPage.get(page) ?? [];
          return (
            <Box
              key={page.name + page.index}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: 1,
                ...(page.index === pages.length - 1
                  ? {
                      borderRight: 1,
                    }
                  : {}),
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
                {columnHeads.map((columnHead, j) =>
                  filter &&
                  !filter({ pageIndex: page.index, columnIndex: j }) ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: 0,
                        width: 7,
                      }}
                      key={String(columnHead[0]) + j}
                    >
                      •
                    </Box>
                  ) : (
                    <Box
                      key={String(columnHead[0]) + j}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "nowrap",
                        borderRight: 1,
                        borderRightStyle: "dashed",
                        borderColor: "text.secondary",
                        ":last-child": {
                          borderRight: 0,
                        },
                      }}
                    >
                      <Box
                        ref={(elm) =>
                          (columnRefs.current[page.name + j] =
                            elm as HTMLElement)
                        }
                        sx={{
                          borderColor: "background.paper",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                          height: "1.5em",
                          bgcolor: "text.secondary",
                          color: "background.paper",
                          textAlign: "center",
                          ...(selectedColumns?.[page.index]?.[j]
                            ? {
                                fontWeight: "bold",
                              }
                            : {}),
                        }}
                      >
                        {utils.encode_col(j)}
                      </Box>
                      {columnHead.map((cellValue, i) => (
                        <Cell
                          {...{
                            isHead: columnHead.length - 1 > i,
                            isSelected:
                              selectedColumns?.[page.index]?.[j] ?? false,
                          }}
                          key={String(cellValue) + i}
                        >
                          <TooltipOnOverflow enterDelay={500}>
                            {cellValue}
                          </TooltipOnOverflow>
                        </Cell>
                      ))}
                      <Box sx={{ flexGrow: 1 }} />
                      <Box sx={{ textAlign: "center" }}>
                        <Checkbox
                          onChange={(_, checked) =>
                            toggleColumn({
                              page: page.index,
                              column: j,
                              selected: checked,
                            })
                          }
                          checked={selectedColumns?.[page.index]?.[j] ?? false}
                        />
                      </Box>
                    </Box>
                  )
                )}
              </Box>
              <Divider />
              <Box
                ref={(elm) =>
                  (pageRefs.current[page.name] = elm as HTMLElement)
                }
              >
                <Box
                  sx={{
                    position: "sticky",
                    left: 0,
                    width: "fit-content",
                    padding: 1,
                    paddingBottom: 0,
                  }}
                >
                  {pages.length > 1 ? <b>{page.name}</b> : null}
                  {columnHeads.length > 15 && (
                    <ButtonGroup sx={{ marginLeft: 2 }} size="small">
                      {[
                        0,
                        Math.round(columnHeads.length / 2),
                        columnHeads.length - 1,
                      ].map((indx) => (
                        <Button
                          key={page.name + indx + "col"}
                          onClick={() =>
                            columnRefs.current[
                              page.name + indx
                            ]?.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                            })
                          }
                          variant="outlined"
                          size="small"
                        >
                          {utils.encode_col(indx)}
                        </Button>
                      ))}
                    </ButtonGroup>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
        <Divider orientation="vertical" flexItem />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {pages.length > 1
          ? pages.map(({ name }) => (
              <Button
                key={name}
                onClick={() =>
                  pageRefs.current[name]?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  })
                }
                variant="outlined"
                size="small"
                sx={{ marginRight: 1 }}
              >
                {name}
              </Button>
            ))
          : t("pages", "One Page: {{name}}", {
              name: pages[0].name,
              count: pages.length,
            })}
      </Box>
    </Box>
  );
}
