import rawNamedEntities from './entities.data';
import { unicodeCharactersPromise, UnicodeCharacter } from './unicode';

export type Character = UnicodeCharacter & {
  readonly entity: {
    readonly hex: string,
    readonly dec: string,
    readonly named: ReadonlyArray<string>
  }
}

const stripEntityWrapperRegex = /^&?(\w+);?$/
export const characters = unicodeCharactersPromise.then((unicodeChars => unicodeChars.map((char) => {
  const entity = rawNamedEntities.find((ent) => ent.characters === char.character);
  const named = Array.from(new Set((entity ? entity.entities : [])
    .map((ent) => ent.replace(stripEntityWrapperRegex, '&$1;'))));
  return Object.assign(char, {
    entity: {
      dec: `&#${char.code};`,
      hex: `&#x${char.code.toString(16).padStart(5, '0')};`,
      named: named
    }
  });
})));

export const namedEntities = characters.then(chars => chars.filter(c => c.entity.named.length > 0));