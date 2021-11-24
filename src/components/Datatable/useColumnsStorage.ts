import { useEffect } from "react";

export function useColumnsStorage({
  storageId,
  selectedColumns,
  columnsSequence,
  setSelectedColumns,
  setColumnsSequence,
}: {
  storageId?: string;
  selectedColumns: string[];
  columnsSequence: string[];
  setSelectedColumns: (arg: string[]) => void;
  setColumnsSequence: (arg: string[]) => void;
}) {
  const localStorageKey = storageId ? `table_${storageId}_columns` : "";

  // load columns
  useEffect(() => {
    if (!localStorageKey) {
      return;
    }
    let mounted = true;
    try {
      const locStor = window.localStorage.getItem(localStorageKey);
      const parsed = locStor ? JSON.parse(locStor) : null;

      if (typeof parsed === "object") {
        const { selectedColumns: locSelected, columnsSequence: locSequence } =
          parsed;

        if (mounted) {
          locSelected?.length > 0 && setSelectedColumns(locSelected);
          locSequence?.length > 0 && setColumnsSequence(locSequence);
        }
      }
    } catch (err) {
      console.warn(err);
    }
    return () => {
      mounted = false;
    };
  }, [setColumnsSequence, setSelectedColumns, localStorageKey]);

  // save columns
  useEffect(() => {
    if (!localStorageKey) {
      return;
    }

    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify({ selectedColumns, columnsSequence })
    );
  }, [localStorageKey, selectedColumns, columnsSequence]);
}
