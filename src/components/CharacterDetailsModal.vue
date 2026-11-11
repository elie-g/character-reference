<script lang="ts">
import { useId } from 'vue';
import { Modal } from 'flowbite'
import { nextFrame } from '@/modules/utils'
import { UnicodeCharacter } from '@/modules/unicode'
import NumbersField from './details/NumbersField.vue'
import TextField from './details/TextField.vue'

export default {
  name: 'CharacterDetailsModal',
  components: { NumbersField, TextField },
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
    class="hidden overflow-hidden fixed w-max xl:min-w-lg max-w-full h-[calc(100%-1rem)] max-h-full m-auto top-0 right-0 left-0 z-50 justify-center items-center md:inset-0"
  >
    <div class="relative p-4 w-full max-w-max max-h-full">
      <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-2 md:p-4">
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
        <div class="space-y-2 md:space-y-4 py-4 md:py-6 w-full overflow-auto">

          <!-- Character -->
          <text-field
            label="Character:"
            :value="char.character"
          />

          <!-- Name -->
          <text-field
            label="Name:"
            :value="char.name"
          />

          <!-- Alias-->
          <text-field
            v-if="char.alias"
            label="Alias:"
            :value="char.alias"
          />

          <!-- Block -->
          <text-field
            label="Block:"
            :value="`${char.block.desc} (${char.block.from.toString(16).toUpperCase().padStart(4, '0')} - ${char.block.to.toString(16).toUpperCase().padStart(4, '0')})`"
          />

          <!-- Category -->
          <text-field
            label="Category:"
            :value="`${char.category.abbr} (${char.category.desc})`"
          />

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

          <!-- Decimal digit value -->
          <text-field
            v-if="char.decimalDigitValue != null"
            label="Decimal digit value:"
            :value="char.decimalDigitValue.toString()"
          />

          <!-- Digit value -->
          <text-field
            v-if="char.digitValue != null"
            label="Digit value:"
            :value="char.digitValue.toString()"
          />

          <!-- Numeric value -->
          <text-field
            v-if="char.numericValue != null"
            label="Numeric value:"
            :value="char.numericValue.toString()"
          />

          <!-- TODO char.mirrored -->
          <!-- TODO char.uppercaseCharacter -->
          <!-- TODO char.lowercaseCharacter -->
          <!-- TODO char.titlecaseCharacter -->

        </div>
      </div>
    </div>
  </div>
</template>
