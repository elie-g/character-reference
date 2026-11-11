import { unicodeCharacterCategories as categories, UnicodeCharacterCategory } from './categories'
import { unicodeCharacterBlocksPromise as blocksPromise, UnicodeCharacterBlock } from './blocks'
import { UNICODE_BASE_URL } from '@/config'

export type UnicodeRawCharacter = {
  codeValue: string,
  characterName: string,
  generalCategory: string,
  canonicalCombiningClass: string,
  bidirectionalCategory: string,
  characterDecompositionMapping: string | null,
  decimalDigitValue: string | null,
  digitValue: string | null,
  numericValue: string | null,
  mirrored: 'Y' | 'N',
  unicode1Name: string | null,
  commentField: string | null,
  uppercaseMapping: string | null,
  lowercaseMapping: string | null,
  titlecaseMapping: string | null
}

export class UnicodeCharacter {
  constructor(
    readonly raw: Readonly<UnicodeRawCharacter>,
    readonly block: Readonly<UnicodeCharacterBlock>,
    readonly category: Readonly<UnicodeCharacterCategory>,
    private readonly _characters: ReadonlyArray<UnicodeCharacter>) {}

  get code(): number {
    return parseInt(this.raw.codeValue, 16);
  }

  get name(): string {
    return this.raw.characterName.startsWith('<') && this.raw.unicode1Name
      ? this.raw.unicode1Name : this.raw.characterName;
  }

  get character(): string { return String.fromCodePoint(this.code); }

  get codePoints(): ReadonlyArray<number> {
    if (this.code >= 0x10000 && this.code <= 0x10FFFF) {
      // Convert to UTF-16 surrogate pair
      const p = this.code - 0x10000;
      return [
        (p >> 10) + 0xD800,
        (p & 0x3FF) + 0xDC00
      ];
    }
    return [ this.code ];
  }

  get decimalDigitValue(): null | number {
    return this.raw.decimalDigitValue ? parseInt(this.raw.decimalDigitValue, 10) : null;
  }

  get digitValue(): null | number {
    return this.raw.digitValue ? parseInt(this.raw.digitValue, 10) : null;
  }

  get numericValue(): null | number {
    if (!this.raw.numericValue)
      return null;
    return this.raw.numericValue
      .split('/')
      .map(v => parseInt(v, 10))
      // @ts-expect-error
      .reduce<number>((a, b) => a / b);
  }

  get mirrored(): boolean {
    return this.raw.mirrored === 'Y';
  }

  get alias(): string | null {
    return this.raw.unicode1Name;
  }

  get uppercaseCode(): number | null {
    return this.raw.uppercaseMapping ? parseInt(this.raw.uppercaseMapping, 16) : null;
  }

  #uppercaseCharacter?: UnicodeCharacter | null;
  get uppercaseCharacter(): UnicodeCharacter | null {
    if (this.#uppercaseCharacter !== undefined)
      return this.#uppercaseCharacter;
    if (!this.raw.uppercaseMapping)
      return this.#uppercaseCharacter = null;
    const code = this.uppercaseCode;
    return this.#uppercaseCharacter = this._characters.find((char) => char.code === code) ?? null;
  }

  get lowercaseCode(): number | null {
    return this.raw.lowercaseMapping ? parseInt(this.raw.lowercaseMapping, 16) : null;
  }

  #lowercaseCharacter?: UnicodeCharacter | null;
  get lowercaseCharacter(): UnicodeCharacter | null {
    if (this.#lowercaseCharacter !== undefined)
      return this.#lowercaseCharacter;
    if (!this.raw.lowercaseMapping)
      return this.#lowercaseCharacter = null;
    const code = this.lowercaseCode;
    return this.#uppercaseCharacter = this._characters.find((char) => char.code === code) ?? null;
  }

  get titlecaseCode(): number | null {
    return this.raw.titlecaseMapping ? parseInt(this.raw.titlecaseMapping, 16) : null;
  }

  #titlecaseCharacter?: UnicodeCharacter | null;
  get titlecaseCharacter(): UnicodeCharacter | null {
    if (this.#titlecaseCharacter !== undefined)
      return this.#titlecaseCharacter;
    if (!this.raw.titlecaseMapping)
      return this.#titlecaseCharacter = null;
    const code = this.titlecaseCode;
    return this.#titlecaseCharacter = this._characters.find((char) => char.code === code) ?? null;
  }
}

///////////////////////////////////////////////////////////////////////

function fetchCharacters(): Promise<ReadonlyArray<UnicodeRawCharacter>> {
  return fetch(new URL(`./UnicodeData.txt`, UNICODE_BASE_URL))
    .then((resp) => resp.text())
    .then((csv: string): UnicodeRawCharacter[] => {
      return csv.split(/\r?\n/g)
        .map((ln: string): string[] => ln.split(';'))
        .filter((cols: string[]) => cols.length > 5 && !cols[0].startsWith('#'))
        .map((cols: string[]): UnicodeRawCharacter => {
          const v = (i: number): string | null => cols[i].trim() || null;
          return {
            codeValue: v(0)!,
            characterName: v(1)!,
            generalCategory: v(2)!,
            canonicalCombiningClass: v(3)!,
            bidirectionalCategory: v(4)!,
            characterDecompositionMapping: v(5),
            decimalDigitValue: v(6),
            digitValue: v(7),
            numericValue: v(8),
            mirrored: v(9) as 'Y' | 'N',
            unicode1Name: v(10),
            commentField: v(11),
            uppercaseMapping: v(12),
            lowercaseMapping: v(13),
            titlecaseMapping: v(14)
          };
        });
      });
}

export const unicodeCharactersPromise: Promise<ReadonlyArray<UnicodeCharacter>> = (async () => {
  const [ blocks, rawCharacters ] = await Promise.all([
    blocksPromise,
    fetchCharacters()
  ]);

  const chars: UnicodeCharacter[] = [];
  for (const rawChar of rawCharacters) {
    const code = parseInt(rawChar.codeValue, 16);
    const block = blocks.find((b) => b.from <= code && b.to >= code);
    const cat = categories.find((c) => c.abbr === rawChar.generalCategory);
    chars.push(new UnicodeCharacter(rawChar, block!, cat!, chars));
  }

  return chars;
})();

export default unicodeCharactersPromise;
