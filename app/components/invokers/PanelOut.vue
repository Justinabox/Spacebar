<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePanelController, type PanelSide } from '@/composables/usePanelController'

const props = withDefaults(defineProps<{
    id?: string
    side?: PanelSide | PanelSide[]
}>(), {
    side: 'right'
})

const { updateZoneEnd } = usePanelController()
const zoneId = props.id ?? `zone-${props.side}-default`

const el = ref<HTMLElement | null>(null)

onMounted(() => {
    if (el.value) {
        updateZoneEnd(zoneId, el.value)
    }
})
</script>

<template>
    <div ref="el" class="panel-out-marker"></div>
</template>
