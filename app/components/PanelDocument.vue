<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { usePanelController } from '@/composables/usePanelController';
import { motion } from "motion-v"

const { panels, updateScroll, sidebarActive } = usePanelController();

const content = ref<HTMLDivElement | null>(null);
const mobileViewport = isMobileViewport();

// Check if there are any registered panels for each side
const hasLeftPanels = computed(() => {
    for (const panel of panels.values()) {
        if (panel.side === 'left') return true;
    }
    return false;
});

const hasRightPanels = computed(() => {
    for (const panel of panels.values()) {
        if (panel.side === 'right') return true;
    }
    return false;
});

function handleScroll() {
  if (content.value) {
    updateScroll(content.value.scrollTop, content.value.clientHeight);
  }
}

onMounted(() => {
  if (content.value) {
    content.value.addEventListener('scroll', handleScroll);
    // Initial calculation
    handleScroll();
  }
});

onBeforeUnmount(() => {
  if (content.value) {
    content.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<template>
    <div class="w-full h-full flex justify-center overflow-y-scroll max-h-full gap-4" ref="content">
        <!-- Left Sidebar -->
        <motion.div 
            v-if="!mobileViewport && hasLeftPanels"
            :initial="false"
            :animate="sidebarActive.left ? 'open' : 'closed'"
            :variants="{
                open: { 
                    width: 'auto', 
                    opacity: 1,
                    maxWidth: '25%',
                },
                closed: { 
                    width: 0, 
                    opacity: 0, 
                    maxWidth: 0, 
                }
            }"
            class="max-w-[500px] h-full sticky top-0 grow-1 relative overflow-hidden prose"
        >
            <div id="panel-teleport-left" class="w-full h-full relative"></div>
        </motion.div>

        <!-- Content -->
        <div class="w-full md:w-[400px] lg:w-[520px] xl:w-[650px] h-fit prose">
            <slot />
        </div>

        <!-- Right Sidebar -->
        <motion.div 
            v-if="!mobileViewport && hasRightPanels"
            :initial="false"
            :animate="sidebarActive.right ? 'open' : 'closed'"
            :variants="{
                open: { 
                    width: 'auto', 
                    opacity: 1,
                    maxWidth: '25%',
                },
                closed: { 
                    width: 0, 
                    opacity: 0, 
                    maxWidth: 0,
                }
            }"
            class="max-w-[500px] h-full sticky top-0 grow-1 relative overflow-hidden prose"
        >
             <div id="panel-teleport-right" class="w-full h-full relative"></div>
        </motion.div>

    </div>
</template>
