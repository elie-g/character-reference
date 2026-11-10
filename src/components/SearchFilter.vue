<script lang="ts">
import { TSearchField, SearchFields, ALL_SEARCH_FIELDS } from '@/modules/search'
import { PropType } from 'vue';

const searchFieldLabels: Record<TSearchField, string> = {
  [SearchFields.CHARACTER]: 'Character',
  [SearchFields.NAME]: 'Name',
  [SearchFields.ENTITIES]: 'Entities',
  [SearchFields.BLOCK]: 'Block',
  [SearchFields.CATEGORY]: 'Category',
  [SearchFields.HEX]: 'Hex'
};

declare module 'vue' {
  interface ComponentCustomProperties {
    ALL_SEARCH_FIELDS: typeof ALL_SEARCH_FIELDS
    searchFieldLabels: typeof searchFieldLabels
  }
}

export default {
  name: 'SearchFilter',
  emits: [
    'update:search',
    'update:fields',
    'update:case-sensitive'
  ],
  props: {
    search: {
      type: String,
      required: false,
      default: ''
    },
    fields: {
      type: Array as PropType<TSearchField[]>,
      required: false,
      default: []
    },
    caseSensitive: {
      type: Boolean,
      required: false,
      default: false
    },
  },

  data() {
    return {
      _localFields: [] as TSearchField[],
    };
  },

  created() {
    this.ALL_SEARCH_FIELDS = ALL_SEARCH_FIELDS;
    this.searchFieldLabels = searchFieldLabels;
  },

  mounted() {
    this.localFields = this.fields?.length ? this.fields
        : [...ALL_SEARCH_FIELDS];
  },

  computed: {
    localSearch: {
      get() { return this.search },
      set(search: string) { this.$emit('update:search', search) }
    },
    localFields: {
      get() { return this._localFields },
      set(fields: TSearchField[]) {
        this._localFields = fields;
        this.$emit('update:fields', fields);
      }
    },
    localCaseSensitive: {
      get() { return this.caseSensitive },
      set(caseSensitive: boolean) {
        this.$emit('update:case-sensitive', caseSensitive);
      }
    }
  },
}
</script>

<template>

  <div class="flex shadow-xs rounded-base -space-x-0.5">
    <label
      for="search"
      class="inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium border-e-0 rounded-s-base"
    >
      <font-awesome-icon icon="fa-magnifying-glass" />
    </label>
    <input
      type="search"
      id="search"
      v-model="localSearch"
      class="px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand block w-full placeholder:text-body"
    />
    <input
      type="checkbox"
      id="case-sensitive"
      v-model="localCaseSensitive"
      class="hidden peer"
    />
    <label
      for="case-sensitive"
      class="inline-flex items-center px-3 text-sm text-body bg-neutral-primary-soft border rounded-s-0 border-default-medium border-s-0 rounded-e-base cursor-pointer hover:bg-neutral-secondary-medium peer-checked:border-brand-subtle peer-checked:bg-brand-softer peer-checked:text-fg-brand-strong peer-checked:hover:bg-brand-softer"
    >Aa</label>
  </div>

  <ul class="select-none grid w-full gap-3 grid-cols-3">
    <li v-for="field in ALL_SEARCH_FIELDS" :key="field">
      <input
        type="checkbox"
        :id="'sf-' + field"
        :value="field"
        v-model="localFields"
        class="hidden peer"
      />
      <label
        :for="'sf-' + field"
        class="block w-full text-center text-body text-sm p-1 bg-neutral-primary-soft border-1 border-default rounded-base cursor-pointer hover:bg-neutral-secondary-medium peer-checked:border-brand-subtle peer-checked:bg-brand-softer peer-checked:text-fg-brand-strong peer-checked:hover:bg-brand-softer"
      >
        {{searchFieldLabels[field]}}
      </label>
    </li>
  </ul>
</template>
