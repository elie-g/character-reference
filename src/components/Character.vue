<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { UnicodeCharacter } from '@/modules/unicode'
import { useMediaQuery } from '@vueuse/core';
import type { Character } from '@/modules/entities'

export default defineComponent({
  name: 'Character',
  emits: [ 'details-button:click' ],
  props: {
    char: {
      type: Object as PropType<Character>,
      required: true,
      validator: (value: Character) => value instanceof UnicodeCharacter
    },
    font: {
      type: String
    },
  },

  data() {
    return {
      canHover: useMediaQuery('(hover: hover)'),
    }
  },

  computed: {
    fontFamily() {
      const fallback = 'Georgia, "Apple Symbols", serif';
      return this.font ? `"${this.font}", ${fallback}` : fallback;
    },
  },

  methods: {
    showDetails() {
      this.$emit('details-button:click', this.char);
    },
  }
})
</script>

<template>
<div class="group relative w-full text-center aspect-square bg-neutral-secondary-soft text-body rounded-lg px-1 py-2" @click="() => canHover ? void 0 : showDetails()">
  <div
    :style="{ fontFamily }"
    class="transition-[font-size] text-5xl group-hover:text-xl">
    {{char.character}}
  </div>

  <div class="text-xs">
    {{char.entity.named.join(' ')}}
  </div>

  <div class="text-xs transition-opacity opacity-0 group-hover:opacity-100">
    {{char.entity.hex}}
  </div>

  <div class="text-xs transition-opacity opacity-0 group-hover:opacity-100">
    {{char.entity.dec}}
  </div>

  <button
    type="button"
    @click="showDetails"
    class="absolute top-0 right-0 mt-2 mr-2 rounded-full text-body-subtle opacity-0 cursor-pointer transition group-hover:opacity-100 hover:text-body
    hover:scale-110"
  >
    <font-awesome-icon icon="circle-info" />
  </button>

</div>
</template>
