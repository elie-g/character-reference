<script lang="ts">
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AsyncWrapper: defineAsyncComponent(() => import('@/AsyncWrapper.vue'))
  }
}
</script>

<template>
  <Suspense>
    <AsyncWrapper #default />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
