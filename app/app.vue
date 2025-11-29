<script setup lang="ts">
import { motion } from "motion-v"
const route = useRoute();
const showSidebar = computed(() => {
    return route.path.startsWith('/projects');
});
</script>

<template>
    <div class="w-screen h-screen max-w-screen max-h-screen gap-4 p-3 flex flex-col">
        <!-- <embed src="https://staging.justzhu.com" class="w-full h-full fixed z-[-1] top-0 left-0 opacity-30" /> -->
        <Header />

        <div class="w-full flex-1 min-h-0 rounded-lg flex">
            <AnimatePresence>
                <motion.div :initial="{ width: 0 }" :animate="{ width: 208 }" :exit="{ width: 0 }" v-if="showSidebar">
                    <Sidebar />
                </motion.div>
            </AnimatePresence>
            <NuxtPage />
        </div>
    </div>
</template>
