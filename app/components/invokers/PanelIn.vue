<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePanelController, type PanelSide } from '@/composables/usePanelController'

const props = withDefaults(defineProps<{
    side?: PanelSide | PanelSide[]
    id?: string
}>(), {
    side: 'right'
})

const { registerZone, unregisterZone, updateZoneStart } = usePanelController()

// We need a stable ID for the zone.
// If id is not provided, we can't easily match PanelOut.
// HOWEVER, if we assume unique IDs are provided in markdown or we auto-generate shared keys...
// For now, let's rely on the user providing IDs or use a shared "global" flow if needed?
// Actually, in markdown `::panelIn` might not have an ID. 
// Let's use a fallback or simple matching if needed, but for now expect ID or use random (which makes matching impossible without context).
// Let's fallback to a "default-side" ID if not provided? No, that breaks multiple zones.
// Let's use the prop ID.

// Workaround: If no ID, we might fail to close it with PanelOut unless PanelOut also guesses the ID.
// Let's assume the user provides `id` or we treat it as "default".
const zoneId = props.id ?? `zone-${props.side}-default`

registerZone(zoneId, props.side)

const el = ref<HTMLElement | null>(null)

onMounted(() => {
    if (el.value) {
        updateZoneStart(zoneId, el.value)
    }
})

onBeforeUnmount(() => {
    unregisterZone(zoneId)
})
</script>

<template>
    <div ref="el" class="panel-in-marker"></div>
</template>
