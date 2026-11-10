<script lang="ts">
export default {
  name: 'SpeedDial',
  emits: [ 'filter:click' ],
  data() {
    return {
      dark: document.documentElement.classList.contains('dark'),
    };
  },

  watch: {
    dark(dark) {
      localStorage.theme = dark ? 'dark' : 'light';
      const { classList } = document.documentElement;
      classList.toggle('dark', dark);
      classList.toggle('light', !dark);
    }
  },
}
</script>

<template>
  <div data-dial-init class="fixed end-6 bottom-6 group">
    <div
      id="speed-dial-menu"
      class="flex flex-col items-center hidden space-y-2"
    >

      <!-- Theme -->
      <input
        type="checkbox"
        id="theme-checkbox"
        v-model="dark"
        class="hidden peer"
      />
      <label
        for="theme-checkbox"
        class="flex justify-center items-center size-10 cursor-pointer text-body hover:text-heading bg-neutral-primary-soft rounded-full border border-default shadow-xs hover:bg-neutral-secondary-medium hover:border-default-medium focus:ring-4 focus:ring-neutral-secondary-soft focus:outline-none peer-checked:border-brand-subtle peer-checked:bg-brand-softer peer-checked:text-fg-brand-strong peer-checked:hover:bg-brand-softer"
      >
        <font-awesome-icon icon="circle-half-stroke" />
      </label>
      <div
        id="tooltip-theme"
        role="tooltip"
        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-center text-body-subtle transition-opacity duration-300 bg-neutral-tertiary-medium rounded-base shadow-xs opacity-0 tooltip"
      >
        Change to <span :class="dark ? 'text-white' : 'text-black'">{{ dark ? 'light' : 'dark' }}</span> theme
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Filter -->
      <button
        type="button"
        @click="$emit('filter:click')"
        data-tooltip-target="tooltip-filters"
        data-tooltip-placement="left"
        class="flex justify-center items-center w-10 h-10 cursor-pointer text-body hover:text-heading bg-neutral-primary-soft rounded-full border border-default shadow-xs hover:bg-neutral-secondary-medium hover:border-default-medium focus:ring-4 focus:ring-neutral-secondary-soft focus:outline-none"
      >
        <font-awesome-icon icon="fa-filter" />
      </button>
      <div
        id="tooltip-filters"
        role="tooltip"
        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-center text-body-subtle transition-opacity duration-300 bg-neutral-tertiary-medium rounded-base shadow-xs opacity-0 tooltip"
      >
        Options & Filters
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    
    </div>
    <button
      type="button"
      data-dial-toggle="speed-dial-menu"
      aria-controls="speed-dial-menu"
      aria-expanded="false"
      class="flex items-center justify-center text-white bg-brand rounded-full w-10 h-10 cursor-pointer hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium focus:outline-none"
    >
      <font-awesome-icon icon="fa-plus" class="transition-transform group-hover:rotate-45"/>
      <span class="sr-only">Open actions menu</span>
    </button>
  </div>
</template>