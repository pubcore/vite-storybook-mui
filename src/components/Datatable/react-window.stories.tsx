import { faker } from "@faker-js/faker";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList,
  FixedSizeGrid,
  VariableSizeGrid,
  ListChildComponentProps,
  GridChildComponentProps,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
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
  title: "Datatable/React Window",
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
}: GridChildComponentProps<GridCellObj[]> & {
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

  const getRows = useCallback<() => GridCellObj[]>(() => {
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

  const getRows = useCallback<() => GridCellObj[]>(() => {
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

  const getRows = useCallback<() => GridCellObj[]>(() => {
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

export const HeaderTest = () => {
  const innerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    console.log("inner style", innerRef.current?.style);
  }, [innerRef]);

  const texts = [
    "Lorem eiusmod cillum nostrud nulla cillum. Exercitation elit quis id cillum fugiat consectetur elit ea excepteur ut ad. Laboris veniam minim do velit duis.",
    "Irure et quis aute occaecat. Cupidatat aute nostrud enim est sit esse commodo mollit sunt pariatur deserunt et ea. Commodo proident sunt est eu consequat proident officia enim consectetur. Commodo elit sunt aliquip aliqua labore tempor duis aute. Amet sint ea deserunt non in minim do aliquip exercitation ex. Culpa ipsum ad officia qui aliqua aliquip aliqua.",
    "Ea sit magna deserunt laboris commodo laborum enim culpa laborum. Aliqua ipsum duis in esse consectetur esse dolor ex. Exercitation occaecat do elit ea sint consectetur sint sint quis aliqua ipsum aliquip magna sint. Sit dolore non officia culpa excepteur minim occaecat aliqua culpa proident adipisicing officia laboris.",
    "Aliqua laborum elit laborum dolor proident in occaecat minim occaecat veniam. Anim irure non magna anim in aliqua irure reprehenderit quis commodo id quis cupidatat. Ad mollit sit fugiat officia eiusmod tempor qui ea sit duis.",
    "Cupidatat aliqua deserunt culpa minim occaecat aliquip. Cillum voluptate ut dolore aliqua ad qui pariatur culpa amet. Officia laborum ea proident excepteur pariatur magna pariatur enim occaecat. Veniam esse Lorem ipsum do deserunt enim aute. Consectetur labore non aute laboris excepteur laborum qui aute pariatur sint et voluptate. Consequat Lorem ipsum laboris esse aute est. Eu magna ipsum eu minim ad laborum.",
    "Consequat culpa esse labore nostrud veniam aliquip fugiat laboris non aliqua fugiat voluptate. Incididunt eiusmod sunt ad laboris sint exercitation pariatur. Deserunt aute nisi est nostrud consequat. Est laborum sunt consequat aliquip magna duis sint commodo occaecat excepteur. Magna culpa consequat minim exercitation eiusmod in ipsum. Enim sit esse ea deserunt eu. Lorem labore officia cupidatat velit laborum fugiat commodo sit.",
    "Ullamco adipisicing aute labore laborum voluptate fugiat culpa. Cillum occaecat sint anim in ea in eiusmod ea qui fugiat. Aliqua enim irure labore ipsum ipsum veniam aliqua dolor consectetur tempor qui in. Eiusmod duis velit cupidatat ex veniam laborum cillum aute laboris do. Cillum deserunt dolor esse ut tempor quis consectetur excepteur id minim dolor voluptate. Ipsum fugiat qui consectetur do.",
  ];

  return (
    <InfiniteLoader
      minimumBatchSize={20}
      threshold={40}
      isItemLoaded={() => true}
      loadMoreItems={() => Promise.resolve()}
      itemCount={50}
    >
      {({ onItemsRendered, ref }) => (
        <div style={{ overflow: "auto" }}>
          <FixedSizeList
            {...{
              height: 400,
              width: 600,
              itemCount: 100,
              itemSize: 30,
              children: (props) => (
                <HeaderTestListRow
                  {...{ ...props, index: props.index - 1, texts }}
                />
              ),
              innerRef,
              ref,
              onItemsRendered,
            }}
          />
        </div>
      )}
    </InfiniteLoader>
  );
};

function HeaderTestHeaderRow({ style }: ListChildComponentProps) {
  return (
    <div
      {...{
        style: {
          ...style,
          position: "sticky",
        },
      }}
    >
      012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
    </div>
  );
}

function HeaderTestListRow({
  style,
  index,
  texts,
}: ListChildComponentProps & { texts: string[] }) {
  return (
    <div
      {...{
        style: {
          ...style,
          textOverflow: "ellipsis",
          overflow: "none",
          whiteSpace: "nowrap",
        },
      }}
    >
      {`${index} - ${texts?.[index % texts.length]}`}
    </div>
  );
}
