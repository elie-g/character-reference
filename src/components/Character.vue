<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { UnicodeCharacter } from '@/modules/unicode'
import type { Character } from '@/modules/entities'
import {  } from '@fortawesome/vue-fontawesome'

export default defineComponent({
  name: 'Character',
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
  emits: [ 'details-button:click' ],

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
<div class="group relative w-full text-center aspect-square bg-neutral-secondary-soft text-body rounded-lg px-1 py-2">
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
