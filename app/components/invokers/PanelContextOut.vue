<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
    id: string
}>()

const linkedNode = ref<HTMLDivElement | null>(null)

const contextManager = inject('panelContextManager') as PanelContextManager

// Update the end node context when the component is mounted
onMounted(() => {
    if (contextManager) {
        contextManager.updateEndNodeContext(props.id, linkedNode)
    }
})
</script>

<template>
    <div ref="linkedNode">
    </div>
</template>