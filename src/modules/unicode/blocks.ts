import { UNICODE_BASE_URL } from '@/config'

export type UnicodeCharacterBlock = {
  from: number
  to: number
  desc: string
}

const commentOrEmptyLineRegex = /^\s*#|^\s*$/
const blockRegex = /^([a-fA-F0-9]+)\.\.([a-fA-F0-9]+);\s*(.*)$/;

export const unicodeCharacterBlocksPromise: Promise<ReadonlyArray<UnicodeCharacterBlock>> = fetch(new URL('./Blocks.txt', UNICODE_BASE_URL))
  .then(resp => resp.text())
  .then(raw => raw.split(/\r?\n/g)
    .filter(ln => !commentOrEmptyLineRegex.test(ln))
    .map(ln => {
      const res = blockRegex.exec(ln);
      if (!res) {
        console.warn('invalid block: ', ln);
        return null;
      }
      return {
        from: parseInt(res[1], 16),
        to: parseInt(res[2], 16),
        desc: res[3].trim()
      } as UnicodeCharacterBlock
    })
    .filter(o => o != null));

export default unicodeCharacterBlocksPromise;
