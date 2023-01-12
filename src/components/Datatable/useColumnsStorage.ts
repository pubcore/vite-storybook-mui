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
  setColumnsSequence: (arg: (selected: string[]) => string[]) => void;
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

        //columns, which has been removed (or added) from static "columns" should
        //be removed from (or added to) "selected" to support e.g. column rename
        const colsToIgnore = locStatic.filter(
          (col) => !staticColumns.includes(col)
        );
        const colsToAdd = staticColumns.filter(
          (col) => !locStatic.includes(col) && !locSelected.includes(col)
        );
        let resetSequence = false;
        locSelected?.length > 0 &&
          setSelectedColumns((selected) => {
            if (locStatic.length <= 0) {
              saveStaticCols();
              resetSequence = true;
              return selected;
            } else if (colsToIgnore.length > 0 || colsToAdd.length > 0) {
              saveStaticCols();
              resetSequence = true;
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

        locSequence?.length > 0 &&
          setColumnsSequence((seq) => {
            if (resetSequence) {
              return staticColumns.concat(
                seq.filter((col) => !staticColumns.includes(col))
              );
            } else {
              return locSequence;
            }
          });
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
