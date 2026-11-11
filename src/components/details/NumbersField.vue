<script lang="ts">
import { useId, useTemplateRef, defineComponent, PropType } from 'vue';
import { Tooltip, CopyClipboard } from 'flowbite';
import type { TooltipOptions } from 'flowbite';

export default defineComponent({
  name: 'NumbersField',
  props: {
    label: { type: String },
    values: {
      type: Array as PropType<ReadonlyArray<number>>,
      required: true,
      validator(values) {
        return Array.isArray(values)
          && values.length >= 1
          && values.every(v => typeof v === 'number');
      }
    },
    id: { type: String },
  },

  created() { this.instances = [] },

  data() {
    const data = {
      hex: false,
      localId: this.id || useId(),
      tooltips: useTemplateRef<HTMLDivElement[]>('tooltip'),
      inputs: useTemplateRef<HTMLInputElement[]>('input'),
      copyButtons: useTemplateRef<HTMLButtonElement[]>('copy-to-clipboard'),
    }
    return data as typeof data & {
      instances: Array<Tooltip | CopyClipboard>
    }
  },

  mounted() { this.init(); },
  updated() {
    this.destroy();
    this.init();
  },
  unmounted() { this.destroy(); },

  methods: {
    init() {
      this.initTooltips();
      this.initCopyClipboards();
    },

    destroy() {
      for (const instance of this.instances.splice(0)) {
        instance.destroyAndRemoveInstance();
      }
    },

    initTooltips() {
      for (const tooltip of this.tooltips!) {
        const triggerEl = document.querySelector<HTMLElement>(`[data-tooltip-target="${tooltip.id}"]`);
        if (triggerEl != null) {
          this.instances.push(new Tooltip(tooltip, triggerEl, {
            placement: (triggerEl.dataset.tooltipPlacement
                || tooltip.dataset.tooltipPlacement
                || 'top') as TooltipOptions['placement'],
            triggerType: 'hover'
          }, {
            id: tooltip.id,
            override: true,
          }));
        }
      }
    },

    initCopyClipboards() {
      for (const cc of this.copyButtons!) {
        const target = document.getElementById(cc.dataset.copyToClipboardTarget!);
        if (target != null) {
          this.instances.push(new CopyClipboard(cc, target as HTMLInputElement, {
            contentType: 'input',
            htmlEntities: false,
            onCopy: () => this.onCopy(cc),
          }, {
            id: cc.id || target.id,
            override: true,
          }));
        }
      }
    },

    onCopy(btn: HTMLButtonElement) {
      this.toggleCopySuccess(btn, true);
      setTimeout(() => this.toggleCopySuccess(btn, false), 2000);
    },

    toggleCopySuccess(btn: HTMLButtonElement, success: boolean) {
      btn.classList.toggle('success', success);

      const tooltipEl = document.getElementById(btn.dataset.tooltipTarget!);
      if (tooltipEl) {
        const defaultMsg = tooltipEl.firstElementChild!;
        const successMsg = defaultMsg.nextElementSibling!;
        tooltipEl.classList.toggle('success', success)
        defaultMsg.classList.toggle('hidden', success);
        successMsg.classList.toggle('hidden', !success);

        const tooltip = FlowbiteInstances.getInstance('Tooltip', tooltipEl.id);
        if (success) {
          requestAnimationFrame(() => tooltip.show());
        } else {
          tooltip.hide();
        }
      }
    },
  },
})
</script>

<template>
  <div :id="localId" class="relative flex">
    <label
      :for="`${localId}-input-0`"
      class="inline-flex items-center me-3"
      v-if="!!label">
      {{label}}
    </label>
    <div class="inline-flex shadow-xs rounded-base">
      <button
        type="button"
        @click="hex = !hex"
        class="inline-flex items-center ps-3 pe-1.5 font-bold text-sm text-body-subtle bg-neutral-secondary-soft border rounded-e-0 border-default-medium border-e-0 rounded-s-base cursor-pointer hover:text-body hover:bg-neutral-secondary-strong focus:ring-0"
      >
        <small style="line-height:normal; width:2ch">
          {{ hex ? '0x' : '10' }}
        </small>
      </button>
      <div class="inline-flex" v-for="(val, idx) in values" :key="idx">
        <input
          type="text"
          ref="input"
          :id="`${localId}-input-${idx}`"
          :value="val.toString(hex ? 16 : 10).toUpperCase()"
          :class="`${hex ? 'font-mono' : 'font-sans'} peer inline-block field-sizing-content w-full ps-2 pr-1 py-2.5 bg-neutral-secondary-medium border border-default-medium border-e-0 text-heading text-sm placeholder:text-body focus:ring-0 focus:border-brand focus:shadow-none`"
          readonly
        />
        <div :class="`inline-flex items-center justify-center pe-1 py-1/2 rounded-base rounded-s-0 ${idx >= values.length - 1 ? '' : 'rounded-e-0 border-e-0'} border border-default-medium border-s-0 bg-neutral-secondary-medium peer-focus:border-brand`">
          <button
            ref="copy-to-clipboard"
            :data-copy-to-clipboard-target="`${localId}-input-${idx}`"
            :data-tooltip-target="`${localId}-input-${idx}-copy-tooltip`"
            class="group text-body cursor-pointer rounded p-1.5 inline-flex items-center justify-center hover:bg-neutral-quaternary"
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
          :id="`${localId}-input-${idx}-copy-tooltip`"
          role="tooltip"
          class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-body transition-opacity duration-300 bg-neutral-secondary-strong rounded-base shadow-xs opacity-0 tooltip [.success]:bg-success [.success]:color-fg-success"
        >
          <span>Copy to clipboard</span>
          <span class="hidden">Copied!</span>
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>
  </div>
</template>
