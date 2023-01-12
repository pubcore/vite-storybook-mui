import { parse } from "path";
import { useEffect } from "react";

export function useColumnsStorage({
  storageId,
  staticColumns,
  selectedColumns,
  columnsSequence,
  setSelectedColumns,
  setColumnsSequence,
}: {
  storageId?: string;
  /**
   * static default columns (initially, not selected by user)
   */
  staticColumns: string[];
  selectedColumns: string[];
  columnsSequence: string[];
  setSelectedColumns: (arg: (selected: string[]) => string[]) => void;
  setColumnsSequence: (arg: string[]) => void;
}) {
  const localStorageKey = storageId ? `table_${storageId}_columns` : "";

  // load columns
  useEffect(() => {
    if (!localStorageKey) {
      return;
    }
    try {
      const locStor = window.localStorage.getItem(localStorageKey);
      const parsed = (
        locStor ? JSON.parse(locStor) : null
      ) as ColumnsStorage | null;

      if (typeof parsed === "object" && parsed !== null) {
        const {
          staticColumns: locStatic = [],
          selectedColumns: locSelected,
          columnsSequence: locSequence,
        } = parsed;

        const saveStaticCols = () => {
          window.localStorage.setItem(
            localStorageKey,
            JSON.stringify({
              selectedColumns: locSelected,
              columnsSequence: locSequence,
              staticColumns,
            })
          );
        };

        //are there columns, which has been removed from static columns
        //this columns should be ignored to support e.g. rename of col names
        const colsToIgnore = locStatic.filter(
          (col) => !staticColumns.includes(col)
        );
        const colsToAdd = staticColumns.filter(
          (col) => !locStatic.includes(col) && !locSelected.includes(col)
        );

        locSelected?.length > 0 &&
          setSelectedColumns((selected) => {
            if (locStatic.length <= 0) {
              saveStaticCols();
              return selected;
            } else if (colsToIgnore.length > 0 || colsToAdd.length > 0) {
              saveStaticCols();
              return Array.from(
                new Set(
                  locSelected
                    .filter((col) => !colsToIgnore.includes(col))
                    .concat(colsToAdd)
                )
              );
            }
            return locSelected;
          });
        locSequence?.length > 0 && setColumnsSequence(locSequence);
      }
    } catch (err) {
      console.warn(err);
    }
  }, [setColumnsSequence, setSelectedColumns, localStorageKey, staticColumns]);

  // save columns
  useEffect(() => {
    if (!localStorageKey) {
      return;
    }
    const locStor = window.localStorage.getItem(localStorageKey);
    const parsed = (
      locStor ? JSON.parse(locStor) : null
    ) as ColumnsStorage | null;

    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        selectedColumns,
        columnsSequence,
        staticColumns: parsed?.staticColumns ?? [],
      })
    );
  }, [localStorageKey, selectedColumns, columnsSequence]);
}

type ColumnsStorage = {
  staticColumns: string[];
  selectedColumns: string[];
  columnsSequence: string[];
};
