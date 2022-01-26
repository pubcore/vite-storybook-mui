import { Box } from "@mui/material";
import Mapper, { MapperProps } from "./Mapper";
import { MappingsJson } from "./MappingsJson";
import { Source } from "./source";

export interface IdColumnsProps {
  source: Source;
  targetIds: string[];
  mappings: NonNullable<MapperProps["mappings"]>;
  save: ({ mappings }: { mappings: MappingsJson["mappings"] }) => void;
}

export function IdColumns({
  source,
  targetIds,
  mappings: mappingsDefault,
  save,
}: IdColumnsProps) {
  return (
    <Box>
      <Mapper
        {...{
          source,
          title: "Identification Columns (IdColumns)",
          targetColumns: targetIds.map((id) => ({ id })),
          targetIds,
          mappings: mappingsDefault,
          save,
        }}
      />
    </Box>
  );
}
