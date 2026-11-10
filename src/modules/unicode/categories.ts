export enum UnicodeCharacterCategoryType {
  NORMATIVE = 'normative',
  INFORMATIVE = 'informative'
}

export type UnicodeCharacterCategoryPart = { char: string, desc: string }

export type UnicodeCharacterCategory = {
  type: UnicodeCharacterCategoryType
  firstPart: UnicodeCharacterCategoryPart
  secondPart: UnicodeCharacterCategoryPart
  readonly abbr: string
  readonly desc: string
}

// [ 'C:Desc', [ 'N:Normative'... ], [ 'I:Informative'... ] ]
const cats:Array<[string, string[], string[]]> = [
  ['L:Letter',
   ['u:Uppercase', 'l:Lowercase', 't:Titlecase'],
   ['m:Modifier', 'o:Other']],
  ['M:Mark', ['n:Non-Spacing', 'c:Spacing Combining', 'e:Enclosing'], []],
  ['N:Number', ['d:Decimal Digit', 'l:Letter', 'o:Other'], []],
  ['Z:Separator', ['s:Space', 'l:Line', 'p:Paragraph'], []],
  ['C:Other', ['c:Control', 'f:Format', 's:Surrogate', 'o:Private Use', 'n:Not Assigned'], []],

  ['P:Punctuation', [], ['c:Connector', 'd:Dash', 's:Open', 'e:Close',
                         'i:Initial quote (may behave like Ps or Pe depending on usage)',
                         'f:Final quote (may behave like Ps or Pe depending on usage)',
                         'o:Other']],
  ['S:Symbol', [], ['m:Math', 'c:Currency', 'k:Modifier', 'o:Other']]
];


function strToCategoyPart(str: string): UnicodeCharacterCategoryPart {
  const arr = str.split(':', 2) as [string, string];
  return { char: arr[0], desc: arr[1] }
}

function mapper(t: UnicodeCharacterCategoryType, firstPart: UnicodeCharacterCategoryPart): (str: string) => UnicodeCharacterCategory {
  return (str: string) => {
    const secondPart = strToCategoyPart(str)
    return {
      type: t,
      firstPart,
      secondPart,
      get abbr(): string {
        return [this.firstPart.char, this.secondPart.char].join('');
      },
      get desc(): string {
        return [this.firstPart.desc, this.secondPart.desc].join(', ');
      }
    }
  }
}

export const unicodeCharacterCategories: ReadonlyArray<UnicodeCharacterCategory> = cats.flatMap(([p, normatives, informatives]) => {
  const firstPart = strToCategoyPart(p);
  return [
    ...normatives.map(mapper(UnicodeCharacterCategoryType.NORMATIVE, firstPart)),
    ...informatives.map(mapper(UnicodeCharacterCategoryType.INFORMATIVE, firstPart)),
  ]
});

export default unicodeCharacterCategories;
