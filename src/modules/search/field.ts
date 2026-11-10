import { Character } from '@/modules/entities'

export const SearchFields = {
  CHARACTER: "CHARACTER",
  NAME: "NAME",
  ENTITIES: "ENTITIES",
  BLOCK: "BLOCK",
  CATEGORY: "CATEGORY",
  HEX: "HEX"
} as const

export type TSearchField = keyof typeof SearchFields

export type TFieldExtractorFunc = (char: Character) => ReadonlyArray<string>

export const ALL_SEARCH_FIELDS: ReadonlyArray<TSearchField>
    = Object.keys(SearchFields) as Array<TSearchField>;

const extractors: Readonly<Record<TSearchField, TFieldExtractorFunc>> = {
  [SearchFields.CHARACTER]: (char) => [char.character],
  [SearchFields.NAME]: (char) => [char.name],
  [SearchFields.ENTITIES]: (char) => char.entity.named,
  [SearchFields.BLOCK]: (char) => [char.block.desc],
  [SearchFields.CATEGORY]: (char) => [char.category.desc],
  [SearchFields.HEX]: (char) => [char.code].concat(char.codePoints).map(c => c.toString(16).padStart(6, '0'))
}

export function extractField(field: TSearchField, char: Character): ReadonlyArray<string> {
  return extractors[field](char);
}