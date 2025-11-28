<script lang="ts" setup>
const route = useRoute()
const { data } = await useAsyncData(route.path, () => {
  return queryCollection('content').path('/' + route.params.project).first()
})
</script>

<template>
    <div class="w-full h-full rounded-lg bg-stone-100">
        <PanelDocument>
            <ContentRenderer v-if="data" :value="data" />
        </PanelDocument>
    </div>
</template>