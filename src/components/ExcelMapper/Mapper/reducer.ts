import { S } from "../maps";
import { selectMappingIndexesByTargetId } from "../maps/selectMappingIndexesByTargetId";
import { selectColumns } from "../source";
import update from "immutability-helper";

export type Action =
  | {
      type: "toggleSourceColumn";
      payload: { page: number; column: number; targetId: string };
    }
  | { type: "changePipe"; payload: { targetId: string; pipe: string } };

export function reducer(state: S, action: Action): S {
  switch (action.type) {
    case "toggleSourceColumn": {
      const { page, column, targetId } = action.payload;
      const col = selectColumns(state.workbook).columnsByPageindex[page]?.[
        column
      ];
      if (col === undefined) {
        console.warn("column not found", column);
        return state;
      }
      const mappingIndex = selectMappingIndexesByTargetId(state).get(targetId);
      if (mappingIndex === undefined) return state;
      const columnIndex =
        state.mappings[mappingIndex]?.sourceColumns.findIndex(
          (column) => column === col
        ) ?? -1;
      return update(state, {
        mappings: {
          [mappingIndex]: {
            sourceColumns:
              columnIndex >= 0
                ? { $splice: [[columnIndex, 1]] }
                : { $push: [col] },
          },
        },
      });
    }
    case "changePipe": {
      const { pipe, targetId } = action.payload;
      const index = selectMappingIndexesByTargetId(state).get(targetId);
      if (index === undefined) return state;
      return update(state, { mappings: { [index]: { pipe: { $set: pipe } } } });
    }
    default:
      return state;
  }
}
