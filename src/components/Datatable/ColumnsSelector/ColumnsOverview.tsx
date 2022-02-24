import { Box } from "@mui/system";
import { useMemo } from "react";

interface ColumnsOverviewProps {
  columnsSequence: string[];
  highlightedCol: string | null;
}

export default function ColumnsOverview({
  columnsSequence,
  highlightedCol,
}: ColumnsOverviewProps) {
  const boxes = useMemo(() => {
    const maxBoxAmt = 25;

    const colAmt = Math.min(columnsSequence.length, maxBoxAmt);
    const highlightIdx = highlightedCol
      ? columnsSequence.length > maxBoxAmt
        ? Math.floor(
            columnsSequence.indexOf(highlightedCol) *
              (maxBoxAmt / columnsSequence.length)
          )
        : columnsSequence.indexOf(highlightedCol)
      : -1;

    console.info(
      "Total col:",
      columnsSequence.length,
      "- highlight idx:",
      highlightIdx,
      "- raw idx:",
      highlightedCol ? columnsSequence.indexOf(highlightedCol) : "N/A"
    );

    const bxs = [];

    for (let i = 0; i < colAmt; i++) {
      bxs.push(
        <Box
          key={i}
          sx={{
            height: 16,
            flexGrow: 1,
            backgroundColor: i === highlightIdx ? "primary.main" : "#c9c9c9",
          }}
          style={{
            marginLeft: i > 0 ? 2 : 0,
            minWidth: 5,
          }}
        ></Box>
      );
    }

    return bxs;
  }, [columnsSequence, highlightedCol]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 1,
        paddingBottom: 0,
      }}
    >
      {boxes}
    </Box>
  );
}
