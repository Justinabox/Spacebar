<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path('/' + route.params.project).first()
})
</script>

<template>
    <div class="w-full h-full rounded-lg bg-stone-400">
        <ContentRenderer v-if="page" :value="page" />
    </div>
</template>