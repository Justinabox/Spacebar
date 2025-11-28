<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePanelController } from '@/composables/usePanelController'

const props = defineProps<{
    id: string
}>()

const linkedNode = ref<HTMLDivElement | null>(null)
const { updateEndNode } = usePanelController()

onMounted(() => {
    if (linkedNode.value) {
        updateEndNode(props.id, linkedNode.value)
    }
})
</script>

<template>
    <div ref="linkedNode"></div>
</template>
