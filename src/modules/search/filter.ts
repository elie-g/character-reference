import { Character } from '@/modules/entities'
import { TSearchField, extractField } from './field'

export interface ISearchFilter {
  search: string,
  caseSensitive?: boolean,
  fields: Array<TSearchField>
}

export function matches(char: Character, filter: ISearchFilter): boolean {
  const search = filter.caseSensitive ? filter.search : filter.search.toLowerCase();
  let values = filter.fields.flatMap(field => extractField(field, char));
  if (!filter.caseSensitive)
    values = values.map(v => v.toLowerCase());
  return values.some(v => v.includes(search));
}