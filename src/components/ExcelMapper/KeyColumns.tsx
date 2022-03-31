import { Box } from "@mui/material";
import Mapper, { MapperProps } from "./Mapper";
import { MappingsJson } from "./MappingsJson";
import { Source } from "./source";

export interface KeyColumnsProps {
  source: Source;
  keyIds: string[];
  mappings: NonNullable<MapperProps["mappings"]>;
  save: ({ mappings }: { mappings: MappingsJson["mappings"] }) => void;
}

export function KeyColumns({
  source,
  keyIds,
  mappings: mappingsDefault,
  save,
}: KeyColumnsProps) {
  return (
    <Box>
      <Mapper
        {...{
          source,
          title: "Identification Columns (IdColumns)",
          targetColumns: keyIds.map((id) => ({ id })),
          keyIds,
          mappings: mappingsDefault,
          save,
        }}
      />
    </Box>
  );
}
