export type MappingsJson = {
  targetIds: string[];
  mappings: Array<{
    sourceColumns: { name: string }[];
    pipe?: string;
    targetId: string;
  }>;
};
