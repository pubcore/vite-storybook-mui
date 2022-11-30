import { useCallback, useReducer } from "react";
import {
  ActionButton,
  DatatableProps,
  FileUpload,
  FileUploadProps,
  acceptExcel,
} from "../";
import { WorkBook, read } from "xlsx";
import WorkbookTeaser from "./WorkbookTeaser";
import { Divider } from "@mui/material";
import Mapper, { MapperProps } from "./Mapper";
import { selectSource } from "./source";
import { KeyColumns, KeyColumnsProps } from "./KeyColumns";
import { MappingsJson } from "./MappingsJson";
import { useTranslation } from "react-i18next";
import { TargetTable } from "./TargetTable";
import { init } from "./init";
import { reducer } from "./reducer";
import { selectMappings } from "./maps/selectMappings";

export interface MappingEditorProps {
  mappings: MappingsJson;
  workbook?: WorkBook;
  save?: ({ mappings }: { mappings: MappingsJson }) => void;
  options?: {
    mapper?: { datatable?: DatatableProps };
    previewTargetTable?: boolean;
  };
}

export function MappingEditor(props: MappingEditorProps) {
  const { mappings: mappingsDefault, save, options } = props;
  const { targetColumns, keyIds } = mappingsDefault;
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, props, init);
  const { workbook, workbookFileName, mappings: mappingsDraft, step } = state;

  const handleFile: FileUploadProps["handleFile"] = useCallback(
    async ({ formData }) => {
      const file = formData.get("file") as File;
      const data = await file?.arrayBuffer();
      const workbook = read(data);

      dispatch({
        type: "loadWorkbook",
        payload: { workbook, fileName: file.name },
      });
    },
    []
  );

  const handleSaveKeyColumns = useCallback<KeyColumnsProps["save"]>(
    ({ mappings }) => {
      dispatch({ type: "setKeyColumns", payload: { mappings } });
    },
    []
  );

  const handleSaveMappings = useCallback<NonNullable<MapperProps["save"]>>(
    ({ mappings }) => {
      if (save) {
        save({
          mappings: selectMappings({
            workbook,
            mappings: mappingsDefault,
            mappingsDraft: { ...mappingsDefault, mappings },
          }),
        });
      } else {
        dispatch({ type: "setMappings", payload: { mappings } });
      }
    },
    [mappingsDefault, save, workbook]
  );

  const mappings = selectMappings({
    workbook,
    mappings: mappingsDefault,
    mappingsDraft,
  });

  if (workbook && workbookFileName) {
    switch (step) {
      case "keyColumns":
        return (
          <KeyColumns
            {...{
              source: selectSource(workbook),
              keyIds,
              mappings: mappings.mappings,
              save: handleSaveKeyColumns,
            }}
          />
        );
      case "map":
        return (
          <>
            <WorkbookTeaser {...{ workbook, fileName: workbookFileName }} />
            <Divider />
            <Mapper
              {...{
                title: t("map_table_title", { name: workbookFileName }),
                source: selectSource(workbook),
                sourceFileName: workbookFileName,
                targetColumns,
                keyIds,
                mappings: mappings.mappings,
                save: handleSaveMappings,
                options: options?.mapper ?? {},
              }}
            />
          </>
        );
      case "preview":
        return (
          <>
            <TargetTable {...{ workbook, mappings }} />
            <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
            {
              <ActionButton
                onClick={() =>
                  handleSaveMappings({ mappings: mappings.mappings })
                }
              >
                {t("save")}
              </ActionButton>
            }
          </>
        );
      default:
        return null;
    }
  } else {
    return (
      <FileUpload
        {...{
          handleFile,
          accept: acceptExcel,
        }}
      />
    );
  }
}
