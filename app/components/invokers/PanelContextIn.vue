<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { usePanelController } from '@/composables/usePanelController'

const props = defineProps<{
    id: string
    side: 'left' | 'right'
}>()

const { registerPanel, unregisterPanel, updateStartNode, getPanelState } = usePanelController()
const mobileViewport = isMobileViewport()

const linkedNode = ref<HTMLDivElement | null>(null)
const isMounted = ref(false)

// Register immediately so layout can prepare targets
registerPanel(props.id, props.side)

const panelState = computed(() => getPanelState(props.id))

onMounted(() => {
    isMounted.value = true
    if (linkedNode.value) {
        updateStartNode(props.id, linkedNode.value)
    }
})

onBeforeUnmount(() => {
    unregisterPanel(props.id)
})
</script>

<template>
    <div ref="linkedNode">
        <!-- Mobile content (inline) -->
        <div v-if="mobileViewport">
            <slot />
        </div>

        <!-- Desktop content (teleported) -->
        <Teleport v-else-if="isMounted" :to="`#panel-teleport-${side}`">
            <div 
                v-if="panelState && panelState.isVisible"
                :style="{ 
                    transform: `translateY(${panelState.offset}px)`,
                    position: 'absolute',
                    width: '100%',
                    left: 0
                }"
            >
                <slot />
            </div>
        </Teleport>
    </div>
</template>
