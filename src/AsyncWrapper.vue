<script setup lang="ts">
import { shallowRef, ref, useTemplateRef, onMounted } from 'vue'
import { characters as charactersPromise } from '@/modules/entities'
import OptionsPanel from '@/components/OptionsPanel.vue'
import CharactersTable from '@/components/CharactersTable.vue'
import SpeedDial from '@/components/SpeedDial.vue'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { initFlowbite } from 'flowbite'
library.add(fas)

const characters = shallowRef(await charactersPromise);
const font = ref('');
const filtersPanel = useTemplateRef<typeof OptionsPanel>('filtersPanel')

function showFilterDrawer() {
  filtersPanel.value!.show()
}


onMounted(() => requestAnimationFrame(() => initFlowbite()));

</script>

<template>
  <OptionsPanel
    ref="filtersPanel"
    v-model:font="font"
    v-model:characters="characters"
  />
  <CharactersTable
    :characters="characters"
    :font="font"
  />
  <SpeedDial
    @filter:click="showFilterDrawer"
  />
</template>
