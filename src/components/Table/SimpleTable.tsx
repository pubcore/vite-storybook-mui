import {
  Table,
  TableProps,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from "@mui/material";

type RowsType = Record<string, unknown>[];

export interface SimpleTableCellProps {
  column: string;
  row: Record<string, unknown>;
  rows?: RowsType;
  index?: number;
}

export interface SimpleTableProps extends Partial<TableProps> {
  rows: RowsType;
  columns: string[];
  Cell: React.FC<SimpleTableCellProps>;
  HeadCell?: React.FC<{ column: string }>;
}

export default function SimpleTable({
  rows,
  columns,
  Cell = () => null,
  HeadCell,
  ...rest
}: SimpleTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" {...rest}>
        {HeadCell && (
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <HeadCell {...{ column }} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} {...{ id: `agpkhn-row-${index}` }}>
              {columns.map((column) => (
                <TableCell align="left" key={column + index}>
                  <Cell {...{ column, row, rows, index }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
