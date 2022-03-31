/**
 * Serializable persistence format of a Mapping
 */
export type MappingsJson = {
  /**
   * At least one targetId must be treated as a key.
   * The set of keyIds must be a subset of targetIds.
   * A key is used to associate rows between pages.
   * For each key, only one column per page is allowed.
   * Order of keys matters: First key (keyIds[0]) MUST map to a column per page.
   * Secondary keys are optional.
   */
  keyIds: string[];
  mappings: Array<{
    sourceColumns: { name: string }[];
    pipe?: string;
    targetId: string;
  }>;
};
