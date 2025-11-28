<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
    id?: string
    side?: 'left' | 'right'
}>(), {
    side: 'right'
})

// Generate a unique ID if not provided (Vue 3.5+ useId, or fallback)
// Since we might be on older Vue version in Nuxt, let's use a simple fallback if needed,
// but Nuxt 3 usually has useId auto-imported from vue.
// If useId is not available, we can use a random string.
const panelId = props.id ?? `panel-${Math.random().toString(36).substring(2, 9)}`

</script>

<template>
    <div class="panel-section">
        <PanelContextIn :id="panelId" :side="side">
            <slot name="panel" />
        </PanelContextIn>
        
        <div class="panel-content">
            <slot />
        </div>

        <PanelContextOut :id="panelId" />
    </div>
</template>

