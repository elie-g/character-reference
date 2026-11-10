<script lang="ts">
import { defineComponent, shallowRef, useId } from 'vue'
import { useDebounceFn, UseDebounceFnReturn } from '@vueuse/core'
import { wait } from '@/modules/utils'
import { Character } from '@/modules/entities'
import { TSearchField, SearchFields, matches } from '@/modules/search'
import { Drawer } from 'flowbite'
import SearchFilter from './SearchFilter.vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    applyFilters: UseDebounceFnReturn<() => void>
  }
}

export interface FontData {
  readonly family: string;
  readonly fullName: string;
  readonly postscriptName: string;
  readonly style: string;
  blob(): Promise<Blob>;
}

declare function queryLocalFonts(options?: { postscriptNames?: string[] }): Promise<FontData[]>

type Filters = {
  search: string,
  searchFields: TSearchField[],
  caseSensitive: boolean,
  named: boolean
}

const initialFilters: Filters = {
  search: '',
  searchFields: [ SearchFields.NAME, SearchFields.ENTITIES ],
  caseSensitive: false,
  named: true,
}

function applyFilters(characters: Character[], filters: Filters) {
  return characters.filter((char) => {
    let keep = true;
    if (keep && filters.named) {
      keep = char.entity.named.length > 0;
    }
    if (keep && filters.search.trim()) {
      keep = matches(char, {
        search: filters.search,
        caseSensitive: filters.caseSensitive,
        fields: filters.searchFields
      });
    }
    // TODO add more filters
    return keep;
  });
}

export default defineComponent({
  name: 'OptionsPanel',
  components: { SearchFilter },
  emits: [ 'update:characters', 'update:font' ],
  props: {
    id: {
      type: String,
      required: false,
      default() { return useId() }
    },
    font: {
      type: String,
      required: false,
      default: ''
    },
    characters: {
      type: Array as () => Character[],
      required: true,
    },
  },

  data() {
    return {
      _drawer: null as Drawer | null,
      opened: false,
      unfilteredCharacters: shallowRef(this.characters),
      fonts: shallowRef(new Set<string>()),
      count: 0,
      loading: {
        fonts: false,
      },
      loaded: {
        fonts: false
      },
      filters: initialFilters,
    }
  },

  created() {
    this.applyFilters = useDebounceFn(() => this._applyFilters(), 350);
    this.applyFilters();
  },

  computed: {
    localFont: {
      get() { return this.font; },
      set(font: string) { this.$emit('update:font', font); }
    },
    drawer() {
      if (this._drawer == null) {
        this._drawer = new Drawer(this.$el, {
          placement: 'left',
          backdrop: true,
          bodyScrolling: true,
        }, {
          override: true,
          id: this.$el.id
        });
      }
      return this._drawer;
    }
  },

  watch: {
    filters: {
      deep: true,
      handler() { this.applyFilters() }
    },
  },

  mounted() {
    this.applyFilters();
    this.loadFonts();
  },

  beforeUnmount() {
    this.applyFilters?.cancel?.();
  },

  methods: {
    _applyFilters() {
      const filters = this.filters;
      const filteredChars = applyFilters(this.unfilteredCharacters,filters);
      this.count = filteredChars.length;
      this.$emit('update:characters', filteredChars);
    },

    loadFonts() {
      if (this.loading.fonts) return;
      this.loaded.fonts = false;
      this.loading.fonts = true;
      Promise.all([
        wait(500),
        queryLocalFonts().then((fonts) => {
          this.fonts = fonts.map((f) => f.family).reduce((s, f) => {
            s.add(f);
            return s;
          }, new Set<string>());
          this.loaded.fonts = true;
        }),
      ]).finally(() => {
        this.loading.fonts = false;
      });
    },

    show() { this.drawer.show() },
    hide() { this._drawer?.hide?.() },
  }
});
</script>

<template>
  <div :id="id" class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-neutral-primary-soft w-80 border-e border-default" tabindex="-1" aria-labelledby="drawer-options-label">
    <div class="border-b border-default pb-4 mb-5 flex items-center">
      <h5 class="inline-flex items-center text-lg font-medium text-body">
        Filters ({{count}} / {{unfilteredCharacters.length}})
      </h5>
      <button
        type="button"
        :aria-controls="id"
        @click="hide"
        class="text-body bg-transparent hover:text-heading hover:bg-neutral-tertiary rounded-base w-9 h-9 absolute top-2.5 inset-e-2.5 flex items-center justify-center"
      >
        <font-awesome-icon icon="fa-xmark" />
        <span class="sr-only">Close menu</span>
      </button>
    </div>
    <div class="mb-6 space-y-4">

      <!-- Named only -->
      <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="filters.named" class="sr-only peer"  />
        <div class="relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
        <span class="ms-3 text-sm font-medium text-heading select-none">
          Named only ?
        </span>
      </label>

      <!-- Font -->
      <div class="flex">
        <label for="font" class="inline-flex items-center">
          <span class="me-3 text-sm font-medium text-heading">Font:</span>
        </label>
        <button
          type="button"
          class="inline-flex items-center shrink-0 z-10 cursor-pointer text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-fg-brand focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-s-base text-sm px-4 py-2.5 focus:outline-none"
          @click="loadFonts()"
        >
          <font-awesome-icon
            icon="fas fa-arrows-rotate"
            :spin="loading.fonts"
            :class="{ animate: loading.fonts }"
          />
        </button>
        <label for="font" class="sr-only">Select a font</label>
        <select
          id="font"
          v-model="localFont"
          class="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-s-0 border-default-medium text-heading text-sm rounded-e-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
        >
          <option value="">Default</option>
          <option v-for="f in fonts"
                  :value="f"
                  :style="{ fontFamily: f }"
                  v-text="f"
          ></option>
        </select>
      </div>

      <!-- Search -->
      <hr/>
      <SearchFilter
        v-model:search="filters.search"
        v-model:fields="filters.searchFields"
        v-model:case-sensitive="filters.caseSensitive"
      />

    </div>
  </div>
</template>

<style>
@reference "@/style.css";

label:has(> input[type="checkbox"][disabled].peer) {
  @apply cursor-not-allowed opacity-50;
}
</style>
