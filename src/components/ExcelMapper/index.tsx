import { DatatableProps } from "../";
import { WorkBook } from "xlsx";
import { MappingsJson } from "./MappingsJson";
import { TargetRow } from "./maps/selectTargetRows";
import { MappingRunner } from "./MappingRunner";
import { MappingEditor } from "./MappingEditor";

export interface ExcelMapperProps {
  workbook?: WorkBook;
  workbookFileName?: string;
  mappings: MappingsJson;
  save?: ({ mappings }: { mappings: MappingsJson }) => void;
  saveTargetTable?: ({
    rows,
    workbookFileName,
  }: {
    rows: TargetRow[];
    workbookFileName?: string;
  }) => void;
  cancel?: () => void;
  options?: {
    mapper?: { datatable?: DatatableProps };
    previewTargetTable?: boolean;
  };
}

export default function ExcelMapper(props: ExcelMapperProps) {
  const { mappings, saveTargetTable, workbook, workbookFileName, cancel } =
    props;

  if (saveTargetTable) {
    return (
      <MappingRunner
        {...{ mappings, saveTargetTable, workbook, workbookFileName, cancel }}
      />
    );
  } else {
    return <MappingEditor {...props} />;
  }
}
