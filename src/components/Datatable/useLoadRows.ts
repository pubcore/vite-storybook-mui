import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DatatableProps, DatatableRow, RowsState } from "./DatatableTypes";

export function useLoadRows({
  loadRows,
  rowState,
  rowsRef,
  minimumBatchSize,
  pageSize,
  page,
  overscan,
}: UseLoadRowsArgs) {
  const { filter, sorting, serverMode } = rowState;
  const count = rowsRef.current?.length ?? 0;

  const loadMoreRows = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (!loadRows) {
        throw TypeError("loadRows is falsy");
      }
      const { rows: newRows } = (await loadRows({
        startIndex,
        stopIndex,
        filter,
        sorting,
      })) ?? { rows: null };
      if (rowsRef.current) {
        rowsRef.current = [
          ...rowsRef.current.slice(0, startIndex),
          ...newRows!,
          ...rowsRef.current.slice(startIndex + newRows!.length),
        ];
      } else {
        rowsRef.current = newRows;
      }
      return;
    },
    [loadRows, filter, sorting, rowsRef]
  );

  const [batchStatus, setBatchStatus] = useState<
    Record<number, Promise<void> | boolean>
  >({ 1: true });

  useEffect(() => {
    setBatchStatus({ 1: true });
    batchIsLoading.current = new Map();
  }, [rowState]);

  const getBatchNumberOfRow = useCallback(
    (index: number) => Math.ceil((index + 1) / minimumBatchSize),
    [minimumBatchSize]
  );

  const batchIsLoading = useRef<Map<number, boolean>>(new Map());
  const checkLoadState = useCallback(
    (batchOfRowindex: number) => {
      if (serverMode) {
        const batchStatusOfRow = batchStatus[batchOfRowindex];
        if (!batchStatusOfRow && !batchIsLoading.current.get(batchOfRowindex)) {
          batchIsLoading.current.set(batchOfRowindex, true);
          const startIndex = (batchOfRowindex - 1) * minimumBatchSize;
          const stopIndex = startIndex + minimumBatchSize - 1;
          console.log("loadMoreRows", startIndex, stopIndex);
          return loadMoreRows(startIndex, stopIndex);
        }
      }
    },
    [batchStatus, loadMoreRows, minimumBatchSize, serverMode]
  );

  useEffect(() => {
    if (!serverMode || count <= 0) {
      return;
    }

    let isMounted = true;
    function checkBatch(batchN: number) {
      checkLoadState(batchN)
        ?.then(() => {
          isMounted &&
            setBatchStatus((s) => (s[batchN] ? s : { ...s, [batchN]: true }));
        })
        .finally(() => {
          batchIsLoading.current.set(batchN, false);
        });
    }
    if (page > 1) {
      const topBatchNumberOfRow = getBatchNumberOfRow(
        Math.max(0, (page - 1) * pageSize - overscan)
      );
      checkBatch(topBatchNumberOfRow);
    }

    const patchNumberOfFirstRow = getBatchNumberOfRow(
      Math.min(count - 1, page * pageSize + 1)
    );
    checkBatch(patchNumberOfFirstRow);

    if (page < count) {
      const bottomBatchNumberOfRow = getBatchNumberOfRow(
        Math.min(count - 1, page * pageSize - 1 + overscan)
      );
      checkBatch(bottomBatchNumberOfRow);
    }
    return () => {
      isMounted = false;
    };
  }, [
    checkLoadState,
    count,
    getBatchNumberOfRow,
    pageSize,
    page,
    overscan,
    serverMode,
  ]);
}

type UseLoadRowsArgs = {
  loadRows: DatatableProps["loadRows"];
  rowsRef: MutableRefObject<DatatableRow[] | null>;
  rowState: RowsState;
  minimumBatchSize: number;
  pageSize: number;
  page: number;
  overscan: number;
};
