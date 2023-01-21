import { DatatableProps } from "../";
import { WorkBook } from "xlsx";
import { MappingsJson } from "./MappingsJson";
import { TargetRow } from "./maps/selectTargetRows";
import { MappingRunner } from "./MappingRunner";
import { MappingEditor } from "./MappingEditor";
import { SystemMap } from "./maps";

export interface ExcelMapperProps {
  workbook?: WorkBook;
  workbookFileName?: string;
  /**
   * user defined mappings, including field and value mappings
   */
  mappings: MappingsJson;
  /**
   * system defined value mappings, e.g. used for general normalizations
   */
  systemMappings?: Record<string, SystemMap[]>;
  save?: ({ mappings }: { mappings: MappingsJson }) => void;
  saveTargetTable?: ({
    rows,
    workbookFileName,
    workbook,
  }: {
    rows: TargetRow[];
    workbookFileName: string;
    workbook: WorkBook;
  }) => void;
  cancel?: () => void;
  options?: {
    mapper?: { datatable?: DatatableProps };
    previewTargetTable?: boolean;
  };
}

export default function ExcelMapper(props: ExcelMapperProps) {
  const {
    mappings,
    saveTargetTable,
    workbook,
    workbookFileName,
    cancel,
    systemMappings,
  } = props;

  if (saveTargetTable) {
    return (
      <MappingRunner
        {...{
          mappings,
          saveTargetTable,
          workbook,
          workbookFileName,
          cancel,
          systemMappings,
        }}
      />
    );
  } else {
    return <MappingEditor {...props} />;
  }
}
