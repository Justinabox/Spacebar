<script setup lang="ts">
import { useSlots, onMounted, inject } from 'vue'

const props = defineProps<{
    id: string
    side: 'left' | 'right'
}>()

const mobileViewport = isMobileViewport()
const slots = useSlots()
const linkedNode = ref<HTMLDivElement | null>(null)

const contextManager = inject('panelContextManager') as PanelContextManager

// Update the start node context when the component is mounted
onMounted(() => {
    console.log("registering:", props.id, props.side, linkedNode.value);
    const slotContent = slots.default?.()
    
    if (contextManager && slotContent && linkedNode && props.id) {
        contextManager.updateStartNodeContext(props.id, linkedNode, slotContent, props.side)
    }
})
</script>

<template>
    <!-- Position reference layer -->
    <div ref="linkedNode">
        <!-- Content Layer -->
        <strong>Context In</strong>
        <div v-if="mobileViewport">
            <slot />
        </div>
    </div>
</template>