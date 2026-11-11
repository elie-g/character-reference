<script lang="ts">
import { CopyClipboard, Tooltip } from 'flowbite';
import { defineComponent, ref, useId, useTemplateRef } from 'vue';

export default defineComponent({
  name: 'TextField',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      localId: this.id || useId(),
      tooltip: useTemplateRef<HTMLElement>('tooltip'),
      input: useTemplateRef<HTMLInputElement>('input'),
      copyButton: useTemplateRef<HTMLElement>('copy-to-clipboard'),
      tooltipInstance: ref<Tooltip | null>(null),
      copyInstance: ref<CopyClipboard | null>(null),
    }
  },

  mounted() {
    this.init();
  },
  updated() {
    this.destroy();
    this.init();
  },
  beforeUnmount() {
    this.destroy();
  },

  methods: {
    init() {
      this.initTooltip();
      this.initCopyClipboard();
    },
    destroy() {
      this.tooltipInstance?.destroyAndRemoveInstance?.();
      this.copyInstance?.destroyAndRemoveInstance?.();
    },
    initTooltip() {
      this.tooltipInstance = new Tooltip(this.tooltip, this.copyButton, {
        placement: 'top',
        triggerType: 'hover'
      }, {
        id: this.tooltip!.id,
        override: true,
      });
    },
    initCopyClipboard() {
      this.copyInstance = new CopyClipboard(this.copyButton, this.input!, {
        contentType: 'input',
        htmlEntities: false,
        onCopy: () => this.onCopy(),
      }, {
        id: this.copyButton!.id,
        override: true,
      })
    },
    onCopy() {
      this.toggleCopySuccess(true);
      setTimeout(() => this.toggleCopySuccess(false), 2000);
    },
    toggleCopySuccess(success: boolean) {
      const btn = this.copyButton!;
      btn.classList.toggle('success', success);

      if (this.tooltip) {
        const defaultMsg = this.tooltip.firstElementChild as HTMLElement;
        const copiedMsg = defaultMsg.nextElementSibling as HTMLElement;
        this.tooltip.classList.toggle('success', success);
        defaultMsg.classList.toggle('hidden', success);
        copiedMsg.classList.toggle('hidden', !success);

        const instance = this.tooltipInstance!;
        if (success) {
          requestAnimationFrame(() => instance.show());
        } else {
          instance.hide();
        }
      }
    }
  }
});
</script>

<template>
  <div :id="localId" class="relative flex">
    <label
      :for="`${localId}-input`"
      class="inline-flex items-center me-3"
    >
      {{ label }}
    </label>
    <div class="inline-flex shadow-xs rounded-base">
      <input
        type="text"
        ref="input"
        :id="`${localId}-input`"
        :value="value"
        class="peer inline-block field-sizing-content text-sm bg-neutral-secondary-medium border border-default-medium border-e-0 text-heading rounded-base rounded-e-0 ps-2 pe-1 py-1.5 focus:ring-0 focus:border-brand focus:shadow-none"
        readonly
      />
      <div class="inline-flex items-center justify-center pe-1 py-1/2 bg-neutral-secondary-medium border border-default-medium border-s-0 rounded-base rounded-s-0 peer-focus:border-brand">
        <button
          ref="copy-to-clipboard"
          type="button"
          :data-copy-to-clipboard-target="`${localId}-input`"
          :data-tooltip-target="`${localId}-input-copy-tooltip`"
          class="group text-body cursor-pointer rounded px-1 py-1/2 inline-flex items-center justify-center hover:bg-neutral-quaternary"
        >
          <span class="relative">
            <span class="transition-opacity duration-300 opacity-100 group-[.success]:opacity-0">
              <font-awesome-icon icon="fa-copy" />
            </span>
            <span class="text-fg-success-strong absolute z-10 top-0 left-0 transition-opacity duration-300 opacity-0 group-[.success]:opacity-100">
              <font-awesome-icon icon="fa-clipboard-check" />
            </span>
          </span>
        </button>
      </div>
      <div
        ref="tooltip"
        :id="`${localId}-input-copy-tooltip`"
        role="tooltip"
        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-body transition-opacity duration-300 bg-neutral-secondary-strong rounded-base shadow-xs opacity-0 tooltip [.success]:bg-success [.success]:color-fg-success"
      >
        <span>Copy to clipboard</span>
        <span class="hidden">Copied!</span>
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>
  </div>
</template>
