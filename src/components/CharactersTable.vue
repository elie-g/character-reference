<script lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useTemplateRef, shallowRef, PropType, defineComponent } from 'vue'
import CharacterDetailsModal from '@/components/CharacterDetailsModal.vue'
import Character from '@/components/Character.vue'
import { VGrid, VGridHandle } from 'virtua/vue'
import type { Character as CharacterType } from '@/modules/entities'

const CHAR_BASE_SIZE = 160;
const GAP = 16;

declare module 'vue' {
  interface ComponentCustomProperties {
    GAP: number,
    refresh(): void
  }
}

export default defineComponent({
  name: 'CharactersTable',
  components: { CharacterDetailsModal, VGrid, Character },
  props: {
    font: {
      type: String,
      required: false,
      default: ''
    },
    characters: {
      type: Array as PropType<ReadonlyArray<CharacterType>>,
      required: false,
      default: []
    },
  },

  beforeCreate() {
    this.GAP = GAP;
    this.refresh = useDebounceFn(() => this._refresh(), 50, { maxWait: 300 })
  },

  data() {
    return {
      grid: useTemplateRef<VGridHandle>('grid'),
      characterDetailsModal: useTemplateRef<typeof CharacterDetailsModal>('characterDetailsModal'),
      context: shallowRef({
        cols: 1,
        rows: [] as CharacterType[][],
        cellWidth: CHAR_BASE_SIZE,
      }),
    };
  },

  mounted() {
    this.refresh();
  },

  watch: {
    characters: 'refresh',
  },

  methods: {
    _refresh() {
      const w = this.grid!.viewportWidth;
      const cols = Math.trunc((w + GAP) / (CHAR_BASE_SIZE + GAP)) || 1;
      const cellWidth = (w + GAP) / cols - GAP;
      const rows = [];
      for (let i = 0; i < this.characters.length; i += cols) {
        rows.push(this.characters.slice(i, i + cols));
      }
      this.context = { cols, rows, cellWidth };
    },
    showDetailsForChar(char: CharacterType) {
      this.characterDetailsModal!.show(char);
    },
  }
})
</script>

<template>
  <CharacterDetailsModal
    ref="characterDetailsModal"
    :font="font"
  />

  <VGrid
    ref="grid"
    :cols="context.cols"
    :rows="context.rows"
    :colWidth="context.cellWidth"
    :rowHeight="context.cellWidth"
    :gap="GAP"
    :style="{ height: '100vh' }"
    class="p-2"
    @resize="refresh"
    #default="{ col, row }"
  >
    <Character
      v-if="col in row"
      :char="row[col]"
      :font="font"
      :style="{ width: `${context.cellWidth}px` }"
      @details-button:click="showDetailsForChar"
    />
  </VGrid>
</template>
