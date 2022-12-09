import { faker } from "@faker-js/faker";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList,
  FixedSizeGrid,
  VariableSizeGrid,
  ListChildComponentProps,
  GridChildComponentProps,
} from "react-window";
import { DatatableColumn, DatatableRow } from "./DatatableTypes";

const listArgs = {
  height: 400,
  width: 600,
  itemSize: 50,
};

const gridArgs = {
  columnWidth: 100,
};

export default {
  title: "Datatable2/React Window Default",
};

const ListRow = ({ index, style, data }: ListChildComponentProps<string[]>) => {
  const val = data[index];
  return val ? (
    <div {...{ style }}>
      {index}: {val}
    </div>
  ) : null;
};

type GridCellObj = {
  [key: string]: string | number;
  name: string;
  balance: number;
};

const GridCell = ({
  style,
  data,
  columnIndex,
  rowIndex,
  columns,
}: GridChildComponentProps<DatatableRow<GridCellObj>[]> & {
  columns: DatatableColumn[];
}) => {
  const colName = columns[columnIndex]?.name;
  const val = colName ? data[rowIndex]?.[colName] : null;
  return val ? <div {...{ style }}>{val}</div> : null;
};

export const ListWithFixedSize = () => {
  const getItems = useCallback(() => {
    return Array.from(Array(50)).map(() => faker.name.fullName());
  }, []);

  const items = getItems();

  return (
    <FixedSizeList
      {...{
        ...listArgs,
        itemCount: items.length,
        itemData: items,
      }}
    >
      {(a) => {
        return <ListRow {...a} />;
      }}
    </FixedSizeList>
  );
};

export const GridWithFixedSize = () => {
  const getColumns = useCallback<() => DatatableColumn[]>(() => {
    return [
      {
        name: "name",
        width: 500,
      },
      {
        name: "job",
        width: 500,
      },
      {
        name: "balance",
        width: 300,
      },
    ];
  }, []);

  const getRows = useCallback<() => DatatableRow<GridCellObj>[]>(() => {
    return Array.from(Array(50)).map(() => ({
      name: faker.name.fullName(),
      job: faker.name.jobTitle(),
      balance: parseFloat(faker.finance.amount()),
    }));
  }, []);

  const columns = getColumns();
  const rows = getRows();

  return (
    <FixedSizeGrid
      {...{
        height: 500,
        width: Math.min(
          window.innerWidth,
          columns.reduce((a, c) => a + c.width, 0)
        ),
        columnCount: columns.length,
        columnWidth: 300,
        rowCount: rows.length,
        rowHeight: 50,
        itemData: rows,
      }}
    >
      {(p) => <GridCell {...{ ...p, columns }} />}
    </FixedSizeGrid>
  );
};

export const GridWithVariableSize = () => {
  const getColumns = useCallback<() => DatatableColumn[]>(() => {
    return [
      {
        name: "name",
        width: 500,
      },
      {
        name: "job",
        width: 500,
      },
      {
        name: "balance",
        width: 300,
      },
    ];
  }, []);

  const getRows = useCallback<() => DatatableRow<GridCellObj>[]>(() => {
    return Array.from(Array(300)).map(() => ({
      name: faker.name.fullName(),
      job: faker.name.jobTitle(),
      balance: parseFloat(faker.finance.amount()),
    }));
  }, []);

  const columns = getColumns();
  const rows = getRows();

  return (
    <VariableSizeGrid
      {...{
        height: 500,
        width: Math.min(
          window.innerWidth,
          columns.reduce((a, c) => a + c.width, 0)
        ),
        columnCount: columns.length,
        columnWidth: (colIdx) => columns[colIdx]?.width ?? 200,
        rowCount: rows.length,
        rowHeight: (rowIdx) => 50,
        itemData: rows,
      }}
    >
      {(p) => <GridCell {...{ ...p, columns }} />}
    </VariableSizeGrid>
  );
};

export const VariableGridAutosizer = () => {
  const getColumns = useCallback<() => DatatableColumn[]>(() => {
    return [
      {
        name: "name",
        width: 900,
      },
      {
        name: "job",
        width: 900,
      },
      {
        name: "balance",
        width: 300,
      },
    ];
  }, []);

  const getRows = useCallback<() => DatatableRow<GridCellObj>[]>(() => {
    return Array.from(Array(300)).map(() => ({
      name: faker.name.fullName(),
      job: faker.name.jobTitle(),
      balance: parseFloat(faker.finance.amount()),
    }));
  }, []);

  const columns = getColumns();
  const rows = getRows();

  const rowHeight = useCallback((_rowIdx: number) => 50, []);
  const columnWidth = useCallback(
    (colIdx: number) => columns[colIdx]?.width ?? 200,
    [columns]
  );

  const HeaderRow = useCallback(
    ({ columns }: { columns: DatatableColumn[] }) => {
      let left = 0;
      return (
        <>
          {columns.map((c, i) => {
            const header = (
              <Typography
                sx={{
                  position: "absolute",
                  left,
                  top: 0,
                  height: rowHeight(0),
                  width: columnWidth(i),
                }}
                key={c.name}
              >
                {c.name}
              </Typography>
            );
            left += columns[i]?.width ?? columnWidth(0);
            return header;
          })}
        </>
      );
    },
    [columnWidth, rowHeight]
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        padding: 3,
      }}
    >
      <HeaderRow {...{ columns }} />
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeGrid
            {...{
              height,
              width,
              columnCount: columns.length,
              columnWidth,
              rowCount: rows.length,
              rowHeight,
              itemData: rows,
            }}
          >
            {(p) => <GridCell {...{ ...p, columns }} />}
          </VariableSizeGrid>
        )}
      </AutoSizer>
    </Box>
  );
};
