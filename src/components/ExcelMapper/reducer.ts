import { WorkBook } from "xlsx";
import { init } from "./init";
import update from "immutability-helper";
import { MappingsJson } from "./MappingsJson";

export type Action =
  | {
      type: "loadWorkbook";
      payload: { workbook: WorkBook; fileName?: string };
    }
  | { type: "setIdColumns"; payload: { mappings: MappingsJson["mappings"] } }
  | { type: "setMappings"; payload: { mappings: MappingsJson["mappings"] } };
type S = ReturnType<typeof init>;

export function reducer(s: S, action: Action) {
  switch (action.type) {
    case "loadWorkbook": {
      const { workbook, fileName } = action.payload;
      return update(s, {
        workbook: { $set: workbook },
        workbookFileName: { $set: fileName },
      });
    }
    case "setIdColumns": {
      const { mappings: newMappings } = action.payload;
      const { mappings = [], targetIds = [] } = s.mappings ?? {};
      let mappingsToSet = mappings;

      for (const targetId of targetIds) {
        const mappingIndex = mappings.findIndex(
          (mapping) => mapping.targetId === targetId
        );
        const newMappingIndex = newMappings.findIndex(
          (mapping) => mapping.targetId === targetId
        );

        if (newMappingIndex >= 0 && mappingIndex < 0) {
          mappingsToSet = update(mappingsToSet, {
            $unshift: [newMappings[newMappingIndex]],
          });
        } else if (newMappingIndex >= 0 && mappingIndex >= 0) {
          mappingsToSet = update(mappingsToSet, {
            [mappingIndex]: { $set: newMappings[newMappingIndex] },
          });
        } else if (newMappingIndex < 0 && mappingIndex >= 0) {
          mappingsToSet = update(mappingsToSet, {
            $splice: [[mappingIndex, 1]],
          });
        }
      }
      return update(s, {
        mappings: { mappings: { $set: mappingsToSet } },
        step: { $set: "map" },
      });
    }
    case "setMappings": {
      const { mappings } = action.payload;
      return update(s, {
        mappings: { mappings: { $set: mappings } },
        step: { $set: "preview" },
      });
    }
    default:
      return s;
  }
}
