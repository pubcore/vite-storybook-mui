import { DatatableProps } from "../";
import { WorkBook } from "xlsx";
import { MappingsJson } from "./MappingsJson";
import { MappingRunner, MappingRunnerProps } from "./MappingRunner";
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
  saveTargetTable?: MappingRunnerProps["saveTargetTable"];
  cancel?: () => void | Promise<void>;
  options?: {
    mapper?: { datatable?: DatatableProps };
    runner?: Pick<MappingRunnerProps, "additionalSteps">;
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
    options,
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
          ...(options?.runner ?? {}),
        }}
      />
    );
  } else {
    return <MappingEditor {...props} />;
  }
}
