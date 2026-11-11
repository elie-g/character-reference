<script lang="ts">
import { useId } from 'vue';
import { Modal } from 'flowbite'
import { nextFrame } from '@/modules/utils'
import { UnicodeCharacter } from '@/modules/unicode'
import NumbersField from './details/NumbersField.vue'

export default {
  name: 'CharacterDetailsModal',
  components: { NumbersField },
  props: {
    font: {
      type: String,
      required: false,
      default: null
    },
    id: {
      type: String,
      required: false,
      default() { return useId() }
    },
  },

  data(): {
    _modal: Modal | null,
    char: UnicodeCharacter | null,
    visible: boolean
  } {
    return {
      _modal: null,
      char: null,
      visible: false
    };
  },

  computed: {
    modal() {
      if (this._modal == null) {
        this._modal = new Modal(this.$el, {
          placement: 'center',
          backdrop: 'dynamic',
          closable: true,
        }, {
          id: this.$el.id,
          override: false
        });
      }
      return this._modal;
    },
    fontFamily() {
      const fallback = 'Georgia, "Apple Symbols", serif';
      return this.font ? `"${this.font}", ${fallback}` : fallback;
    },
  },

  methods: {
    async show(char: UnicodeCharacter) {
      if (char == null)
        throw 'no character specified';
      this.char = char;
      await nextFrame();
      this.modal.show();
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this._modal?.hide?.();
    },
  },
}
</script>

<template>
  <div
    :id="id"
    v-if="char != null"
    tabindex="-1"
    :aria-hidden="visible"
    aria-modal="true"
    role="dialog"
    class="hidden overflow-y-auto overflow-x-hidden fixed w-max xl:min-w-lg max-w-[calc] m-auto top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-2x1 max-h-full">
      <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
          <h3 class="text-lg font-medium text-heading">
            Character:
            <kbd
              :style="{ fontFamily }"
              class="px-2 py-1.5 text-xl ms-[1ch] font-normal bg-neutral-tertiary border border-default-medium rounded-base"
            >
              {{ char.character }}
            </kbd>
          </h3>
          <button
            type="button"
            @click="hide"
            class="text-body bg-transparent rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center cursor-pointer hover:bg-neutral-tertiary hover:text-heading"
          >
            <font-awesome-icon icon="fa-xmark" />
            <span class="sr-only">Close modal</span>
          </button>
        </div>

          <!-- Modal body -->
        <div class="space-y-4 md:space-y-6 py-4 md:py-6">


          <!-- TODO char.name -->
          <!-- TODO char.character -->

          <!-- Code -->
          <numbers-field
            label="Code:"
            :values="[ char.code ]"
          />

          <!-- Code points -->
          <numbers-field
            label="Code points:"
            :values="char.codePoints"
          />

          <!-- TODO char.decimalDigitValue -->
          <!-- TODO char.digitValue -->
          <!-- TODO char.numericValue -->
          <!-- TODO char.mirrored -->
          <!-- TODO char.alias -->
          <!-- TODO char.uppercaseCharacter -->
          <!-- TODO char.lowercaseCharacter -->
          <!-- TODO char.titlecaseCharacter -->

        </div>
      </div>
    </div>
  </div>
</template>
